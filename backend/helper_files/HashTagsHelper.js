import sqlite3 from "sqlite3";
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs-node';
import dotenv from "dotenv";

dotenv.config({ path: `/Users/isaaclucero/Desktop/InstagramProfileApp/backend/helper_files/../.env` });

const dbFile = "instagram_data.sqlite";
const USER_ID = process.env.INSTA_USER_ID;

/**
 * Extracts hashtags from a given caption.
 * @param {string} caption - The caption containing hashtags.
 * @returns {string[]} An array of extracted hashtags.
 */
function extractHashtags(caption) {
  if (!caption) return [];
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [];
  let match;
  while ((match = hashtagRegex.exec(caption)) !== null) {
    hashtags.push(match[1]);
  }
  return hashtags;
}

/**
 * Retrieves average engagement data for categorized hashtags.
 * @returns {Promise<Object>} An object containing categorized hashtags and average engagement data.
 */
async function getHashtagCategoriesAverageData() {
  const db = new sqlite3.Database(dbFile);
  try {
    const query = `SELECT * FROM hashtags${USER_ID}`;
    const rows = await getAllRows(db, query);
    let hashtags = [];
    let hashtagData = {};
    let hashtagEngagement = {};

    rows.forEach(row => {
      hashtags.push(row.hashtag);
      hashtagEngagement[row.hashtag] = {
        likes: row.likes,
        comments: row.comments,
        total_engagement: row.total_engagement
      };
    });

    let hashtagCategories = await categorizeHashtags(hashtags);

    for (const key in hashtagCategories) {
      if (!hashtagData[key]) {
        hashtagData[key] = { likes: 0, comments: 0, engagement: 0, count: 0 };
      }
      for (const hashtag of hashtagCategories[key]) {
        const currElement = hashtagEngagement[hashtag];
        hashtagData[key].likes += currElement.likes;
        hashtagData[key].comments += currElement.comments;
        hashtagData[key].engagement += currElement.total_engagement;
        hashtagData[key].count += 1;
      }
    }

    let categoryAverages = {};
    Object.keys(hashtagData).forEach(category => {
      let data = hashtagData[category];
      categoryAverages[category] = {
        avgLikes: data.count > 0 ? data.likes / data.count : 0,
        avgComments: data.count > 0 ? data.comments / data.count : 0,
        avgEngagement: data.count > 0 ? data.engagement / data.count : 0
      };
    });

    return { hashtagCategories, categoryAverages };
  } catch (error) {
    console.error('Error calculating category averages:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

/**
 * Categorizes a list of hashtags based on semantic similarity.
 * Uses the Universal Sentence Encoder for NLP-based categorization.
 * @param {string[]} hashtags - An array of hashtags to categorize.
 * @returns {Promise<Object>} An object mapping categories to hashtag lists.
 */
async function categorizeHashtags(hashtags) {
  const categories = {
    Lifestyle: "Keywords related to daily life, routine, and lifestyle.",
    Fitness: "Keywords related to health, gym, and workout.",
    Food: "Keywords related to food, cooking, and recipes.",
    Travel: "Keywords related to travel, vacation, and wanderlust.",
    Cars: "Keywords related to cars and make or model",
    Colors: "Keywords related to colors",
    Season: "Keywords related to the seasons of the year"
  };

  console.log("Loading Universal Sentence Encoder model...");
  const model = await use.load();
  const categoryKeys = Object.keys(categories);
  const categoryDescriptions = Object.values(categories);
  const categoryEmbeddings = await model.embed(categoryDescriptions);
  const hashtagEmbeddings = await model.embed(hashtags);

  // Function to calculate cosine similarity
  function cosineSimilarity(vec1, vec2) {
    const dotProduct = tf.tidy(() => tf.sum(tf.mul(vec1, vec2)));
    const normVec1 = tf.tidy(() => tf.sqrt(tf.sum(tf.square(vec1))));
    const normVec2 = tf.tidy(() => tf.sqrt(tf.sum(tf.square(vec2))));
    return dotProduct.div(normVec1.mul(normVec2)).arraySync();
  }

  // Match hashtags to categories
  const categorizedHashtags = Object.fromEntries(categoryKeys.map(key => [key, []]));

  hashtags.forEach((hashtag, i) => {
    const similarities = categoryEmbeddings.arraySync().map(categoryVec =>
      cosineSimilarity(hashtagEmbeddings.slice([i, 0], [1, -1]), tf.tensor(categoryVec))
    );
    const bestMatchIdx = similarities.indexOf(Math.max(...similarities));
    categorizedHashtags[categoryKeys[bestMatchIdx]].push(hashtag);
  });

  return categorizedHashtags;
}

/**
 * Retrieves all rows from a given SQL query.
 * @param {sqlite3.Database} db - SQLite database instance.
 * @param {string} query - SQL query to execute.
 * @returns {Promise<Object[]>} A promise resolving to the rows of the query result.
 */
function getAllRows(db, query) {
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

/**
 * Retrieves hashtag count per post timestamp.
 * @returns {Promise<Object[]>} Array of objects with timestamps and hashtag counts.
 */
async function getHashtagsTimeData() {
  const db = new sqlite3.Database(dbFile);
  try {
    const query = `SELECT caption, timestamp FROM user${USER_ID}`;
    const rows = await getAllRows(db, query);
    return rows.map(row => ({
      timestamp: row.timestamp || null,
      hashtag_count: extractHashtags(row.caption).length || 0
    }));
  } catch (error) {
    console.error('Error retrieving hashtag time data:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

/**
 * Calculates the average number of hashtags used per post.
 * @returns {Promise<number>} The average number of hashtags per post.
 */
async function calculateAverageHashtagsPerPost() {
  const db = new sqlite3.Database(dbFile);
  try {
    const query = `SELECT caption FROM user${USER_ID}`;
    const rows = await getAllRows(db, query);
    const totalHashtags = rows.reduce((sum, row) => sum + extractHashtags(row.caption).length, 0);
    return rows.length > 0 ? totalHashtags / rows.length : 0;
  } catch (error) {
    console.error('Error calculating average hashtags per post:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

/**
 * Retrieves the top 5 most commonly used hashtags.
 * @returns {Promise<Object[]>} Array of top 5 hashtags with their usage count.
 */
async function getTopFiveHashtags() {
  const db = new sqlite3.Database(dbFile);
  try {
    const query = `SELECT hashtag, media_ids FROM hashtags${USER_ID}`;
    const rows = await getAllRows(db, query);

    // Count occurrences of each hashtag
    const hashtagCounts = rows.map(row => ({
      hashtag: row.hashtag,
      count: JSON.parse(row.media_ids)?.length || 0
    }));

    // Sort by count in descending order and return top 5
    return hashtagCounts.sort((a, b) => b.count - a.count).slice(0, 5);
  } catch (error) {
    console.error('Error retrieving top hashtags:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

export {
  calculateAverageHashtagsPerPost,
  getTopFiveHashtags,
  getHashtagsTimeData,
  getHashtagCategoriesAverageData
};
