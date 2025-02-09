import sqlite3 from 'sqlite3';
const dbFile = 'instagram_data.sqlite';
import dotenv from 'dotenv';
import { pipeline } from "@xenova/transformers";
dotenv.config({ path: './.env' });
const instaUserId = process.env.INSTA_USER_ID; 

async function getTopCommenter() {
    const db = new sqlite3.Database(dbFile);
    const query = `SELECT comments FROM user${instaUserId} WHERE comments IS NOT NULL;`;
    return new Promise((resolve, reject) => {
      db.all(query, [], (err, rows) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
          return;
        }
        const commentCounts = {};
        for (const row of rows) {
          let comments;
          try {
            comments = JSON.parse(row.comments); // Convert string to JSON
            if (!row.comments) continue; // Skip if comments are null
          } catch (error) {
            console.error("JSON parse error:", error);
            continue;
          }
          if (comments.length) {
            for (const comment of comments) {
              if (comment.username) {
                commentCounts[comment.username] = (commentCounts[comment.username] || 0) + 1;
              }
            }
          }
        }
        const topUser = Object.entries(commentCounts).reduce(
          (top, [username, count]) => (count > top.count ? { username, count } : top),
          { username: null, count: 0 }
        );
        db.close();
        resolve(topUser);
      });
    });
  }

// Load the sentiment-analysis model
async function classifyComments() {
    const classifier = await pipeline("sentiment-analysis", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");

    const comments = ["I love this post!", "This is terrible.", "It's okay, I guess."];
    
    for (const comment of comments) {
        const result = await classifier(comment);
        console.log(`Comment: "${comment}" -> Sentiment: ${result[0].label}, Score: ${result[0].score.toFixed(4)}`);
    }
}
  

export {getTopCommenter, classifyComments};