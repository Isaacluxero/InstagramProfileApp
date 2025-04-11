import sqlite3 from 'sqlite3';
const dbFile = 'instagram_data.sqlite';
import dotenv from 'dotenv';
import { pipeline } from "@xenova/transformers";

dotenv.config({ path: './.env' });
const instaUserId = process.env.INSTA_USER_ID; 

/**
 * Retrieves all comments from the SQLite database for a given Instagram user.
 * @returns {Promise<string[]>} A promise that resolves to an array of comment texts.
 */
async function getAllComments() {
  const db = new sqlite3.Database(dbFile);
  const query = `SELECT comments FROM user${instaUserId} WHERE comments IS NOT NULL;`;
  
  return new Promise((resolve, reject) => {
    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Database error:", err);
        reject(err);
        return;
      }
      
      var comments = [];
      for (const row of rows) {
        var commentsSection = JSON.parse(row.comments);
        for (const post of commentsSection) {
          var comment = post.text;
          comments.push(comment);
        }
      }
      
      db.close();
      resolve(comments);
    });
  });
}

/**
 * Classifies comments using a pre-trained transformer model for sentiment analysis.
 * @returns {Promise<Object[]>} A promise that resolves to an array of sentiment statistics.
 */
async function classifyComments() {
  const classifier = await pipeline("sentiment-analysis", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");
  var comments = await getAllComments();
  const sentimentStats = {
      POSITIVE: { label: "POSITIVE", count: 0, totalScore: 0 },
      NEGATIVE: { label: "NEGATIVE", count: 0, totalScore: 0 },
      NEUTRAL: { label: "NEUTRAL", count: 0, totalScore: 0 }
  };

  for (const comment of comments) {
      const [result] = await classifier(comment);
      const { label, score } = result;

      if (label in sentimentStats) {
          sentimentStats[label].count += 1;
          sentimentStats[label].totalScore += score;
      } else {
          sentimentStats.NEUTRAL.count += 1;
          sentimentStats.NEUTRAL.totalScore += score;
      }
  }

  return Object.values(sentimentStats).map(({ label, count, totalScore }) => ({
      label,
      count,
      avgScore: count > 0 ? (totalScore / count).toFixed(4) : 0
  }));
}

export { classifyComments };
