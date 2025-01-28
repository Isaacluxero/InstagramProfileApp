import sqlite3 from 'sqlite3';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs-node';
const dbFile = 'instagram_data.sqlite';

// Helper function to extract hashtags from a caption
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

async function categorizeHashtags(hashtags) {
  // Predefined categories and their descriptions
  const categories = {
    Lifestyle: "Keywords related to daily life, routine, and lifestyle.",
    Fitness: "Keywords related to health, gym, and workout.",
    Food: "Keywords related to food, cooking, and recipes.",
    Travel: "Keywords related to travel, vacation, and wanderlust."
  };

  console.log("Loading Universal Sentence Encoder model...");
  const model = await use.load(); // Load USE model

  // Generate embeddings for category descriptions
  const categoryKeys = Object.keys(categories);
  const categoryDescriptions = Object.values(categories);
  const categoryEmbeddings = await model.embed(categoryDescriptions);

  // Generate embeddings for hashtags
  const hashtagEmbeddings = await model.embed(hashtags);

  // Function to calculate cosine similarity
  function cosineSimilarity(vec1, vec2) {
    const dotProduct = tf.tidy(() => tf.sum(tf.mul(vec1, vec2)));
    const normVec1 = tf.tidy(() => tf.sqrt(tf.sum(tf.square(vec1))));
    const normVec2 = tf.tidy(() => tf.sqrt(tf.sum(tf.square(vec2))));
    return dotProduct.div(normVec1.mul(normVec2)).arraySync();
  }

  // Match hashtags to categories
  const categorizedHashtags = categoryKeys.reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  hashtags.forEach((hashtag, i) => {
    const similarities = categoryEmbeddings.arraySync().map(categoryVec =>
      cosineSimilarity(hashtagEmbeddings.slice([i, 0], [1, -1]), tf.tensor(categoryVec))
    );
    const bestMatchIdx = similarities.indexOf(Math.max(...similarities));
    const bestCategory = categoryKeys[bestMatchIdx];
    categorizedHashtags[bestCategory].push(hashtag);
  });

  return categorizedHashtags;
}

// Promisified function to get all rows from the database
function getAllRows(db, query) {
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });
}

async function calculateAverageHashtagsPerPost(instaUserId) {
  const db = new sqlite3.Database(dbFile);
  try {
    const query = `SELECT caption FROM user${instaUserId}`;
    const rows = await getAllRows(db, query);

    let totalHashtags = 0;
    const totalPosts = rows.length;

    rows.forEach(row => {
      const hashtags = extractHashtags(row.caption);
      totalHashtags += hashtags.length;
    });

    const averageHashtags = totalPosts > 0 ? totalHashtags / totalPosts : 0;
    return averageHashtags;
  } catch (error) {
    console.error('Error calculating average hashtags per post:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

/**
 * Function to get the top 5 most common hashtags across all posts in the database for a specific user.
 * @param {string} instaUserId - The Instagram user ID whose hashtags will be analyzed.
 * @returns {Promise<Object[]>} A promise that resolves to an array of the top 5 hashtags with their counts, ranked from most to least common.
 */
async function getTopFiveHashtags(instaUserId) {
  const db = new sqlite3.Database(dbFile);
  try {
    const query = `SELECT hashtag, media_ids FROM hashtags${instaUserId}`;
    const rows = await new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Error querying database:', err.message);
          return reject(err);
        }
        resolve(rows);
      });
    });
    let topHashtag = null;
    let maxCount = 0;
    rows.forEach(row => {
      const mediaIds = JSON.parse(row.media_ids); // Parse media_ids JSON array
      const count = mediaIds.length; // Count the number of media IDs
      if (count > maxCount) {
        maxCount = count;
        topHashtag = { hashtag: row.hashtag, count };
      }
    });
    return topHashtag || { message: 'No hashtags found' };
  } catch (error) {
    console.error('Error retrieving top hashtag:', error.message);
    throw error;
  } finally {
    db.close();
  }
}

export { calculateAverageHashtagsPerPost, getTopFiveHashtags, categorizeHashtags };


