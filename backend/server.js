import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { calculateAverageHashtagsPerPost, getTopFiveHashtags, getHashtagsTimeData, getHashtagCategoriesAverageData } from './helper_files/HashTagsHelper.js';
import { insertIntoTable, extractHashtagsAndStore } from './helper_files/LoginHelper.js';
import { calculateAverageEngagement, getEngagementTimeData } from './helper_files/UserMetricsHelper.js';
import { classifyComments } from './helper_files/CommentsHelper.js';

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
      console.error('Failed to open database:', err.message);
      return res.status(500).json({ message: 'Failed to open the database' });
    }
  });

  const username = `user${userId}`;
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${username} (
      id TEXT PRIMARY KEY,         
      caption TEXT,                
      like_count INTEGER,          
      comments_count INTEGER,      
      comments JSON,               
      saves INTEGER,               
      total_engagement INTEGER,    
      media_type TEXT,             
      media_url TEXT,              
      timestamp TEXT               
    );
  `;
  
  db.run(createTableQuery, function (err) {
    if (err) {
      console.error('Failed to create table:', err.message);
      return res.status(500).json({ message: 'Failed to create the table' });
    }
    try {
      insertIntoTable(userId, accessToken)  
        .then(() => {
          extractHashtagsAndStore(userId, accessToken);
          res.json({ message: 'Data saved successfully' });
        })
        .catch((error) => {
          console.error('Failed to insert data:', error.message);
          res.status(500).json({ message: 'Failed to insert data' });
        });
    } catch (error) {
      console.error('Unexpected error during data processing:', error.message);
      res.status(500).json({ message: 'Unexpected error occurred' });
    }
  });
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
    console.error('Failed to calculate top hashtags:', error.message);
    res.status(500).json({ message: 'Internal server error while calculating top hashtags' });
  }
});

/**
 * Endpoint to classify comments.
 * @returns {Object} JSON response containing classified comments.
 */
app.get('/getCommentsClassified', async (req, res) => {
  try {
    const result = await classifyComments();
    res.json({ result });
  } catch (error) {
    console.error('Failed to classify comments:', error.message);
    res.status(500).json({ message: 'Internal server error while classifying comments' });
  }
});

/**
 * Endpoint to retrieve follower count over time.
 * @returns {Object} JSON response containing follower count over time.
 */
app.get('/getFollowerCountOverTime', async (req, res) => {
  try {
    const result = await getFollowerCountOverTime();
    res.json({ result });
  } catch (error) {
    console.error('Failed to get follower count over time:', error.message);
    res.status(500).json({ message: 'Internal server error while fetching follower count over time' });
  }
});

/**
 * Endpoint to calculate the average number of hashtags per post for a specific user.
 * @param {string} instaUserId - The Instagram user ID whose data is being analyzed.
 * @returns {Object} JSON response containing the average number of hashtags per post.
 */
app.get('/calculateAverageHashtags', async (req, res) => {
  try {
    const average = await calculateAverageHashtagsPerPost();
    res.json({ average });
  } catch (error) {
    console.error('Failed to calculate average hashtags per post:', error.message);
    res.status(500).json({ message: 'Internal server error while calculating average hashtags' });
  }
});

/**
 * Endpoint to retrieve hashtags time-based data.
 * @returns {Object} JSON response containing time-based hashtags data.
 */
app.get('/getHashtagsTimeData', async (req, res) => {
  try {
    const result = await getHashtagsTimeData();
    res.json(result);
  } catch (error) {
    console.error('Failed to get hashtags time data:', error.message);
    res.status(500).json({ message: 'Internal server error while fetching hashtags time data' });
  }
});

/**
 * Endpoint to calculate the average data for hashtag categories.
 * @returns {Object} JSON response containing average data for hashtag categories.
 */
app.get('/getHashTagCategories', async (req, res) => {
  try {
    const result = await getHashtagCategoriesAverageData();
    res.json({ result });
  } catch (error) {
    console.error('Failed to get hashtag categories average data:', error.message);
    res.status(500).json({ message: 'Internal server error while fetching hashtag categories data' });
  }
});

/**
 * Endpoint to calculate the average engagement for a specific user.
 * @returns {Object} JSON response containing average engagement metrics.
 */
app.get('/getAverageEngagement', async (req, res) => {
  try {
    const result = await calculateAverageEngagement();
    res.json(result);
  } catch (error) {
    console.error('Failed to calculate average engagement:', error.message);
    res.status(500).json({ message: 'Internal server error while calculating average engagement' });
  }
});

/**
 * Endpoint to retrieve engagement time-based data.
 * @returns {Object} JSON response containing engagement time data.
 */
app.get('/getEngagementTimeData', async (req, res) => {
  try {
    const result = await getEngagementTimeData();
    res.json(result);
  } catch (error) {
    console.error('Failed to get engagement time data:', error.message);
    res.status(500).json({ message: 'Internal server error while fetching engagement time data' });
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
