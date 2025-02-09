import sqlite3 from 'sqlite3';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
const dbFile = 'instagram_data.sqlite';
const BASE_URL = 'https://graph.facebook.com/v17.0';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: `${__dirname}/../.env` });

/**
 * Inserts media data for a given Instagram user into the database.
 * @param {string} instaUserId - The Instagram user ID.
 * @param {string} accessToken - The access token for authentication.
 */
async function insertIntoTable(instaUserId, accessToken) {
  updateEnvVariable('ACCESS_TOKEN', accessToken);
  updateEnvVariable('INSTA_USER_ID', instaUserId);
  const db = new sqlite3.Database(dbFile);
  const url = `${BASE_URL}/${instaUserId}/media?fields=id,caption,like_count,comments_count,media_type,media_url,timestamp&access_token=${accessToken}`;
  let currPage = await axios.get(url).then(response => response.data);
  const insertQuery = `
    INSERT INTO user${instaUserId} (id, caption, like_count, comments_count, comments, saves, total_engagement, media_type, media_url, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const checkQuery = `
    SELECT COUNT(*) AS count
    FROM user${instaUserId}
    WHERE id = ?;
  `;
  while (currPage.data) {
    const currData = currPage.data;
    var mediaIds = '';
    for (const post of currData) {
      const { id, caption, like_count, comments_count, media_type, media_url, timestamp } = post;
      mediaIds += `${id},`;
      const exists = await new Promise((resolve) => {
        db.get(checkQuery, [id], (err, row) => {
          if (err) {
            console.error('Error querying the database:', err);
            resolve(false);
          } else {
            resolve(row && row.count > 0);
          }
        });
      });
      if (!exists) {
        const getCommentsUrl = `${BASE_URL}/${id}/comments?fields=id,text,username&access_token=${accessToken}`;
        var comments = await axios.get(getCommentsUrl).then(response => response.data.data);
        await new Promise((resolve) => {
          db.run(insertQuery, [id, caption, like_count, comments_count, JSON.stringify(comments), 0, 0, media_type, media_url, timestamp], (err) => {
            if (err) {
              console.error('Error inserting data:', err);
            }
            resolve();
          });
        });
      }
    }
    mediaIds = mediaIds.slice(0,-1);
    var mediaIdsArr = mediaIds.split(',');
    const updateQuery = `
      UPDATE user${instaUserId}
      SET total_engagement = ?, saves = ?
      WHERE id = ?;
    `;
    const insightsURL = `${BASE_URL}/?ids=${mediaIds}&fields=insights.metric(saved,total_interactions)&access_token=${accessToken}`;
    var insights = await axios.get(insightsURL).then(response => response.data);
    mediaIdsArr.forEach(async (currMediaId) => {
      var currPost = insights[currMediaId];
      var saves = currPost.insights.data[0].values[0].value;
      var totalEngagement = currPost.insights.data[1].values[0].value;
      await new Promise((resolve) => {
        db.run(updateQuery, [totalEngagement, saves, currMediaId], (err) => {
          if (err) {
            console.error('Error inserting saves:', err);
          }
          resolve();
        });
      });
    });
    if (currPage.paging && currPage.paging.next) {
      const nextPageUrl = currPage.paging.next;
      currPage = await axios.get(nextPageUrl).then(response => response.data);
    } else {
      break;
    }
  }
  db.close();
}

// Function to update or add new variables in the .env file
function updateEnvVariable(key, value) {
  const envFilePath = path.resolve(__dirname, '../.env'); // Path to .env file in 'backend'
  // Read the current .env file
  const envContent = fs.readFileSync(envFilePath, 'utf-8');
  // Check if the key already exists
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(envContent)) {
      // If the key exists, replace it
      const updatedContent = envContent.replace(regex, `${key}=${value}`);
      fs.writeFileSync(envFilePath, updatedContent, 'utf-8');
  } else {
      // If the key doesn't exist, append it to the file
      fs.appendFileSync(envFilePath, `\n${key}=${value}`, 'utf-8');
  }
}

/**
 * Function to extract hashtags from media and store them in the hashtags table.
 * @param {string} instaUserId - The Instagram user ID whose post data will be analyzed.
 */
async function extractHashtagsAndStore(instaUserId) {
  const db = new sqlite3.Database(dbFile);
    const dropTableQuery = `DROP TABLE IF EXISTS hashtags${instaUserId}`;
    await new Promise((resolve, reject) => {
      db.run(dropTableQuery, (err) => {
        if (err) {
          console.error('Error dropping table:', err.message);
          reject(err);
        }
        resolve();
      });
    });
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS hashtags${instaUserId} (
      hashtag TEXT PRIMARY KEY,
      media_ids TEXT,   -- JSON array to store media IDs
      likes INTEGER,    -- Total likes for the hashtag
      comments INTEGER  -- Total comments for the hashtag
    );
  `;
  await new Promise((resolve) => {
    db.run(createTableQuery, () => {
      resolve();
    });
  });
  const query = `SELECT id, caption, like_count, comments_count FROM user${instaUserId}`;
  const rows = await new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      resolve(rows);
    });
  });
  for (let row of rows) {
    const { id: mediaId, caption, like_count: likes, comments_count: comments } = row;
    const hashtags = extractHashtagsFromCaption(caption);
    for (let hashtag of hashtags) {
      const existingHashtag = await new Promise((resolve, reject) => {
        const checkHashtagQuery = `SELECT * FROM hashtags${instaUserId} WHERE hashtag = ?`;
        db.get(checkHashtagQuery, [hashtag], (err, result) => {
          resolve(result);
        });
      });

      if (existingHashtag) {
        const mediaIds = JSON.parse(existingHashtag.media_ids);
        if (!mediaIds.includes(mediaId)) {
          mediaIds.push(mediaId);
        }
        await new Promise((resolve, reject) => {
          const updateQuery = `
            UPDATE hashtags${instaUserId}
            SET media_ids = ?, likes = likes + ?, comments = comments + ?
            WHERE hashtag = ?
          `;
          db.run(updateQuery, [JSON.stringify(mediaIds), likes, comments, hashtag], (err) => {
            resolve();
          });
        });
      } else {
        await new Promise((resolve, reject) => {
          const insertQuery = `
            INSERT INTO hashtags${instaUserId} (hashtag, media_ids, likes, comments)
            VALUES (?, ?, ?, ?)
          `;
          db.run(insertQuery, [hashtag, JSON.stringify([mediaId]), likes, comments], (err) => {
            resolve();
          });
        });
      }
    }
  }
  db.close();
  return 'Hashtags extracted and stored successfully!';
}

// Helper function to extract hashtags from a caption
function extractHashtagsFromCaption(caption) {
  if (!caption) return [];
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;
  while ((match = hashtagRegex.exec(caption)) !== null) {
    hashtags.push(match[1]);
  }
  return hashtags;
}

export { insertIntoTable, extractHashtagsAndStore, updateEnvVariable};