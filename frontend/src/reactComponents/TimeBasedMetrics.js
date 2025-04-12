import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../css/TimeBasedMetrics.module.css';
import LoadingPage from './reactUtils/LoadingPage.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function TimeBasedMetrics() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [timeData, setTimeData] = useState([]);
    const [bestTimes, setBestTimes] = useState([]);
    const [heatmapData, setHeatmapData] = useState([]);

    const goToHome = () => {
        navigate('/home');
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/getTimeMetrics');
                setTimeData(response.data.timeData);
                setBestTimes(response.data.bestTimes);
                setHeatmapData(response.data.heatmapData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching time metrics:', error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className={styles.timeBasedMetricsPage}>
            <div className={styles.metricsContainer}>
                <header>
                    <h1 className={styles.generalMetricsHeader}>Time-Based Metrics</h1>
                </header>
                <button
                    className={styles['login-back-button']}
                    onClick={goToHome}
                    title="Go back to home page"
                >
                    Back to Home
                </button>

                <div className={styles.metricSection}>
                    <h2>Optimal Posting Times</h2>
                    <div className={styles.bestTimesContainer}>
                        {bestTimes.map((day, index) => (
                            <div key={index} className={styles.timeCard}>
                                <h3>{day.day}</h3>
                                <p>Best Time: {day.bestTime}</p>
                                <p>Engagement: {day.engagement}%</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.metricSection}>
                    <h2>Engagement by Time of Day</h2>
                    <div className={styles.heatmapContainer}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={heatmapData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="time" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="engagement" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={styles.metricSection}>
                    <h2>Performance by Time Period</h2>
                    <div className={styles.performanceGrid}>
                        {timeData.map((period, index) => (
                            <div key={index} className={styles.periodCard}>
                                <h3>{period.period}</h3>
                                <p>Posts: {period.posts}</p>
                                <p>Engagement: {period.engagement}%</p>
                                <p>Reach: {period.reach}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TimeBasedMetrics; 