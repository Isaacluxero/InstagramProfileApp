import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

const dbFile = 'instagram_data.sqlite';
dotenv.config({ path: `../.env` });
const USER_ID = process.env.INSTA_USER_ID;

/**
 * Calculates the average engagement metrics for an Instagram user.
 * This function retrieves all posts from the database and computes
 * average likes, saves, comments, and total engagement.
 * @returns {Promise<Object>} - An object containing averageLikes, averageSaves,
 *                              averageEngagement, and averageComments.
 */
async function calculateAverageEngagement() {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database(dbFile);
        const query = `SELECT comments_count, saves, total_engagement, like_count FROM user${USER_ID}`;

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error querying database:', err.message);
                db.close();
                return reject(err);
            }

            let totalLikes = 0;
            let totalSaves = 0;
            let totalEngagement = 0;
            let totalComments = 0;
            let totalPosts = rows.length; 

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

            db.close(); 
            resolve(result);
        });
    });
}

/**
 * Retrieves engagement data over time for an Instagram user's posts.
 * This function fetches timestamps along with likes, comments, saves, 
 * and total engagement from the database.
 * @returns {Promise<Array>} - An array of objects containing timestamp, like_count, 
 *                             comments_count, saves, and total_engagement.
 */
async function getEngagementTimeData() {
    const db = new sqlite3.Database(dbFile);

    return new Promise((resolve, reject) => {
        const query = `SELECT timestamp, like_count, comments_count, saves, total_engagement FROM user${USER_ID}`;

        db.all(query, [], (err, rows) => {
            if (err) {
                console.error('Error querying database:', err.message);
                db.close();
                return reject(err);
            }
            db.close(); 
            resolve(rows);
        });
    });
}

export { calculateAverageEngagement, getEngagementTimeData };


