import sqlite3 from 'sqlite3';
import axios from 'axios';
const dbFile = 'instagram_data.sqlite';
const BASE_URL = 'https://graph.facebook.com/v17.0';

/**
 * Inserts media data for a given Instagram user into the database.
 * @param {string} instaUserId - The Instagram user ID.
 * @param {string} accessToken - The access token for authentication.
 */
async function insertIntoTable(instaUserId, accessToken) {
  const db = new sqlite3.Database(dbFile);
  const url = `${BASE_URL}/${instaUserId}/media?fields=id,caption,like_count,comments_count,media_type,media_url,timestamp&access_token=${accessToken}`;
  let currPage = await axios.get(url).then(response => response.data);
  const insertQuery = `
    INSERT INTO user${instaUserId} (id, caption, like_count, comments_count, total_engagement, media_type, media_url, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const checkQuery = `
    SELECT COUNT(*) AS count
    FROM user${instaUserId}
    WHERE id = ?;
  `;
  while (currPage.data) {
    const currData = currPage.data;
    for (const post of currData) {
      const { id, caption, like_count, comments_count, media_type, media_url, timestamp } = post;
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
        var totalEngagement = like_count + comments_count;
        await new Promise((resolve) => {
          db.run(insertQuery, [id, caption, like_count, comments_count, totalEngagement, media_type, media_url, timestamp], (err) => {
            if (err) {
              console.error('Error inserting data:', err);
            }
            resolve();
          });
        });
      }
    }
    if (currPage.paging && currPage.paging.next) {
      const nextPageUrl = currPage.paging.next;
      currPage = await axios.get(nextPageUrl).then(response => response.data);
    } else {
      break;
    }
  }
  db.close();
}

/**
 * Retrieves the Instagram username for a given page ID.
 * @param {string} pageId - The page ID of the Instagram user.
 * @param {string} accessToken - The access token for authentication.
 * @returns {Promise<string>} - The Instagram username.
 */
async function getInstaUsername(pageId, accessToken) {
  const url = `${BASE_URL}/${pageId}?fields=name&access_token=${accessToken}`;
  try {
    const response = await axios.get(url);
    console.log(`Instagram username: ${response.data.name}`);
    return response.data.name;
  } catch (error) {
    console.error(
      'Error fetching Instagram username:',
      error.response?.data || error.message
    );
    throw error;
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

export { insertIntoTable, getInstaUsername, extractHashtagsAndStore };