import sqlite3 from 'sqlite3';
import axios from 'axios';
const dbFile = 'instagram_data.sqlite';
const BASE_URL = 'https://graph.facebook.com/v17.0';

async function calculateAverageLikes(instaUserId) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFile);
        const query = `SELECT like_count FROM user${instaUserId}`;
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error querying database:', err.message);
                return reject(err);
            }
            let totalLikes = 0;
            let totalPosts = 0;
            rows.forEach(row => {
            const media = JSON.parse(row.media);
            media.forEach(post => {
                totalPosts++;
                totalLikes += post.like_count || 0;
            });
            });
            const averageLikes = totalPosts > 0 ? totalLikes / totalPosts : 0;
            resolve(averageLikes);
        });
    });
  }

  async function calculateAverageComments(instaUserId) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFile);
        const query = `SELECT comments_count FROM user${instaUserId}`;
        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error querying database:', err.message);
                return reject(err);
            }
            let totalLikes = 0;
            let totalPosts = 0;
            rows.forEach(row => {
            const media = JSON.parse(row.media);
            media.forEach(post => {
                totalPosts++;
                totalLikes += post.like_count || 0;
            });
            });
            const averageLikes = totalPosts > 0 ? totalLikes / totalPosts : 0;
            resolve(averageLikes);
        });
    });
  }

export {calculateAverageLikes, calculateAverageComments};
