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
 * Inserts Instagram media data into a SQLite database for a given user.
 * This function retrieves posts from the Instagram API, checks if they exist in the database,
 * and inserts new ones. It also fetches comments and engagement metrics (saves, total interactions).
 * @param {string} instaUserId - The Instagram user ID.
 * @param {string} accessToken - The access token for authentication.
 */
async function insertIntoTable(instaUserId, accessToken) {
  updateEnvVariable('ACCESS_TOKEN', accessToken);
  updateEnvVariable('INSTA_USER_ID', instaUserId);
  const db = new sqlite3.Database(dbFile);
  const url = `${BASE_URL}/${instaUserId}/media?fields=id,caption,like_count,comments_count,media_type,media_url,timestamp&access_token=${accessToken}`;
  let currPage = await axios.get(url).then(response => response.data);

  // SQL queries
  const insertQuery = `
    INSERT INTO user${instaUserId} (id, caption, like_count, comments_count, comments, saves, total_engagement, media_type, media_url, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const checkQuery = `
    SELECT COUNT(*) AS count FROM user${instaUserId} WHERE id = ?;
  `;

  // Loop through paginated media data
  while (currPage.data) {
    const currData = currPage.data;
    let mediaIds = '';

    for (const post of currData) {
      const { id, caption, like_count, comments_count, media_type, media_url, timestamp } = post;
      mediaIds += `${id},`;

      // Check if the media already exists in the database
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

      // Insert the media if it does not already exist
      if (!exists) {
        const getCommentsUrl = `${BASE_URL}/${id}/comments?fields=id,text,username&access_token=${accessToken}`;
        const comments = await axios.get(getCommentsUrl).then(response => response.data.data);
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

    mediaIds = mediaIds.slice(0, -1);
    const mediaIdsArr = mediaIds.split(',');

    // Fetch engagement insights for media
    const insightsURL = `${BASE_URL}/?ids=${mediaIds}&fields=insights.metric(saved,total_interactions)&access_token=${accessToken}`;
    const insights = await axios.get(insightsURL).then(response => response.data);

    // Update the database with saves and total engagement metrics
    const updateQuery = `
      UPDATE user${instaUserId}
      SET total_engagement = ?, saves = ?
      WHERE id = ?;
    `;

    mediaIdsArr.forEach(async (currMediaId) => {
      const currPost = insights[currMediaId];
      const saves = currPost.insights.data[0].values[0].value;
      const totalEngagement = currPost.insights.data[1].values[0].value;
      await new Promise((resolve) => {
        db.run(updateQuery, [totalEngagement, saves, currMediaId], (err) => {
          if (err) {
            console.error('Error updating saves:', err);
          }
          resolve();
        });
      });
    });

    // Proceed to the next page of media data if available
    if (currPage.paging && currPage.paging.next) {
      currPage = await axios.get(currPage.paging.next).then(response => response.data);
    } else {
      break;
    }
  }

  db.close();
}

/**
 * Updates or adds environment variables in the .env file.
 * This function ensures that credentials or configuration values can be updated dynamically.
 * @param {string} key - The environment variable key.
 * @param {string} value - The new value to be set.
 */
function updateEnvVariable(key, value) {
  const envFilePath = path.resolve(__dirname, '../.env');
  const envContent = fs.readFileSync(envFilePath, 'utf-8');
  const regex = new RegExp(`^${key}=.*$`, 'm');

  if (regex.test(envContent)) {
    const updatedContent = envContent.replace(regex, `${key}=${value}`);
    fs.writeFileSync(envFilePath, updatedContent, 'utf-8');
  } else {
    fs.appendFileSync(envFilePath, `\n${key}=${value}`, 'utf-8');
  }
}

/**
 * Extracts hashtags from captions and stores them in a dedicated hashtags table.
 * This function analyzes media captions, extracts hashtags, and aggregates engagement metrics.
 * @param {string} instaUserId - The Instagram user ID whose post data will be analyzed.
 */
async function extractHashtagsAndStore(instaUserId) {
  const db = new sqlite3.Database(dbFile);
  const dropTableQuery = `DROP TABLE IF EXISTS hashtags${instaUserId}`;

  await new Promise((resolve, reject) => {
    db.run(dropTableQuery, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS hashtags${instaUserId} (
      hashtag TEXT PRIMARY KEY,
      media_ids TEXT,
      likes INTEGER,
      comments INTEGER,
      total_engagement INTEGER
    );
  `;
  await new Promise((resolve, reject) => {
    db.run(createTableQuery, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const query = `SELECT id, caption, like_count, comments_count, total_engagement FROM user${instaUserId}`;
  const rows = await new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  for (let row of rows) {
    const { id: mediaId, caption, like_count: likes, comments_count: comments, total_engagement } = row;
    const hashtags = extractHashtagsFromCaption(caption);

    for (let hashtag of hashtags) {
      const existingHashtag = await new Promise((resolve, reject) => {
        const checkHashtagQuery = `SELECT * FROM hashtags${instaUserId} WHERE hashtag = ?`;
        db.get(checkHashtagQuery, [hashtag], (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });

      if (existingHashtag) {
        let mediaIds = JSON.parse(existingHashtag.media_ids || '[]');
        if (!mediaIds.includes(mediaId)) mediaIds.push(mediaId);

        await new Promise((resolve, reject) => {
          const updateQuery = `
            UPDATE hashtags${instaUserId}
            SET media_ids = ?, likes = likes + ?, comments = comments + ?, total_engagement = total_engagement + ?
            WHERE hashtag = ?
          `;
          db.run(updateQuery, [JSON.stringify(mediaIds), likes, comments, total_engagement, hashtag], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      } else {
        await new Promise((resolve, reject) => {
          const insertQuery = `
            INSERT INTO hashtags${instaUserId} (hashtag, media_ids, likes, comments, total_engagement)
            VALUES (?, ?, ?, ?, ?)
          `;
          db.run(insertQuery, [hashtag, JSON.stringify([mediaId]), likes, comments, total_engagement], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
      }
    }
  }

  db.close();
  return 'Hashtags extracted and stored successfully!';
}

/**
 * Extracts hashtags from a given caption.
 * @param {string} caption - The caption containing hashtags.
 * @returns {string[]} - An array of extracted hashtags.
 */
function extractHashtagsFromCaption(caption) {
  if (!caption) return [];
  return [...caption.matchAll(/#(\w+)/g)].map(match => match[1]);
}

export { insertIntoTable, extractHashtagsAndStore, updateEnvVariable };
