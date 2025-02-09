import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { calculateAverageHashtagsPerPost, getTopFiveHashtags,  categorizeHashtags } from './helper_files/HashTagsHelper.js';
import { insertIntoTable, extractHashtagsAndStore } from './helper_files/LoginHelper.js';
import { calculateAverageEngagement, getEngagementTimeData} from './helper_files/UserMetricsHelper.js';
import { getTopCommenter} from './helper_files/CommentsHelper.js';
const app = express();
app.use(cors());
app.use(bodyParser.json());
const dbFile = 'instagram_data.sqlite';

/**
 * Endpoint to store data from the frontend in the SQLite database.
 * @param {string} userId - The Instagram user ID to identify the user.
 * @param {string} accessToken - The access token for making API calls to Instagram.
 * @returns {Object} JSON response indicating success or failure.
 */
app.post('/storeData', (req, res) => {
  const { userId, accessToken } = req.body; 
  const db = new sqlite3.Database(dbFile, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      return res.status(500).json({ message: 'Database error' });
    }
  });
  const username = `user${userId}`;
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${username} (
      id TEXT PRIMARY KEY,         -- Unique identifier for each media item
      caption TEXT,                -- Caption of the media
      like_count INTEGER,          -- Number of likes
      comments_count INTEGER,      -- Number of comments
      comments JSON,               -- Number of comments
      saves INTEGER,               -- Number of saves
      total_engagement INTEGER,    -- Number of comments
      media_type TEXT,             -- Type of media (e.g., image, video)
      media_url TEXT,              -- URL of the media
      timestamp TEXT               -- Timestamp of when the media was posted
    );
  `;
  db.run(createTableQuery, function (err) {
    if (err) {
      console.error('Error creating table:', err.message);zzzzz
      return res.status(500).json({ message: 'Error creating table' });
    }
    try {
      insertIntoTable(userId, accessToken)  // Function inserts the media data into the newly structured table
        .then(() => {
          extractHashtagsAndStore(userId, accessToken);  // Function to handle hashtags if needed
          res.json({ message: 'Data saved successfully' });
        })
        .catch((error) => {
          console.error('Error inserting data:', error.message);
          res.status(500).json({ message: 'Error inserting data' });
        });
    } catch (error) {
      console.error('Unexpected error:', error.message);
      res.status(500).json({ message: 'Unexpected error occurred' });
    }
  });
});

/**
 * Endpoint to calculate the top five hashtags used per user.
 * @param {string} instaUserId - The Instagram user ID whose data is being analyzed.
 * @returns {Object} JSON response containing the top five hashtags used.
 */
app.post('/getHashTagCategories', async (req, res) => {
  try {
    const { instaUserId } = req.body; 
    const result = await  categorizeHashtags(['gym', 'happy']);
    res.json({ result });
  } catch (error) {
    console.error('Error calculating average hashtags:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


/**
 * Endpoint to calculate the top five hashtags used per user.
 * @param {string} instaUserId - The Instagram user ID whose data is being analyzed.
 * @returns {Object} JSON response containing the top five hashtags used.
 */
app.post('/getTopHashtags', async (req, res) => {
  try {
    const { instaUserId } = req.body; 
    const result = await getTopFiveHashtags(instaUserId);
    res.json({ result });
  } catch (error) {
    console.error('Error calculating average hashtags:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Endpoint to calculate the average number of hashtags per post for a specific user.
 * @param {string} instaUserId - The Instagram user ID whose data is being analyzed.
 * @returns {Object} JSON response containing the average number of hashtags per post.
 */
app.post('/calculateAverageHashtags', async (req, res) => {
  try {
    const { instaUserId } = req.body; 
    const average = await calculateAverageHashtagsPerPost(instaUserId);
    res.json({ average });
  } catch (error) {
    console.error('Error calculating average hashtags:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Endpoint to calculate the top five hashtags used per user.
 * @param {string} instaUserId - The Instagram user ID whose data is being analyzed.
 * @returns {Object} JSON response containing the top five hashtags used.
 */
app.get('/getAverageEngagement', async (req, res) => {
  try {
    const result = await calculateAverageEngagement(); // Calls the function correctly
    res.json(result);
  } catch (error) {
    console.error('Error calculating top commenter:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Endpoint to calculate the top five hashtags used per user.
 * @param {string} instaUserId - The Instagram user ID whose data is being analyzed.
 * @returns {Object} JSON response containing the top five hashtags used.
 */
app.get('/getEngagementTimeData', async (req, res) => {
  try {
    const result = await getEngagementTimeData(); // Calls the function correctly
    res.json(result);
  } catch (error) {
    console.error('Error calculating top commenter:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Start the Express server and listen on the specified port.
 * @param {number} port - The port on which the server will listen.
 */
const port = 5001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
