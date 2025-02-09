import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import axios from 'axios';
const dbFile = 'instagram_data.sqlite';
dotenv.config({ path: `/Users/isaaclucero/Desktop/InstagramProfileApp/backend/helper_files/../.env` });
const USER_ID = process.env.INSTA_USER_ID;
const BASE_URL = process.env.BASE_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

async function calculateAverageEngagement() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFile);
        const query = `SELECT comments_count, saves, total_engagement, like_count FROM user${USER_ID}`;
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error querying database:', err.message);
                db.close(); // Ensure DB connection is closed on error
                return reject(err);
            }
            let totalLikes = 0;
            let totalSaves = 0;
            let totalEngagement = 0;
            let totalComments = 0;
            let totalPosts = rows.length; // Directly get total posts from row count
            rows.forEach(row => {
                totalComments += row.comments_count || 0;
                totalSaves += row.saves || 0;
                totalEngagement += row.total_engagement || 0;
                totalLikes += row.like_count || 0;
            });
            const result = {
                averageLikes: totalPosts > 0 ? totalLikes / totalPosts : 0,
                averageSaves: totalPosts > 0 ? totalSaves / totalPosts : 0,
                averageEngagement: totalPosts > 0 ? totalEngagement / totalPosts : 0,
                averageComments: totalPosts > 0 ? totalComments / totalPosts : 0
            };
            db.close(); // Close DB connection
            resolve(result);
        });
    });
}
async function getEngagementTimeData() {
    const db = new sqlite3.Database(dbFile);
    return new Promise((resolve, reject) => {
        db.all(`SELECT timestamp, like_count, comments_count, saves, total_engagement FROM user${USER_ID}`, [], (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  
export {calculateAverageEngagement, getEngagementTimeData};

