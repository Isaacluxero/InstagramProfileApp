import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import styles from '../css/UserMetrics.module.css';
import UserMetricsGraph from './UserMetricsGraph.js';

function UserMetrics() {
  const navigate = useNavigate(); 
  const goToLogin = () => {
    navigate('/home'); 
  };
  const [averageComments, setAverageComments] = useState(false);
  const [averageLikes, setAverageLikes] = useState(false);
  const [averageSaves, setAverageSaves] = useState(false);
  const [averageEngagement, setAverageEngagement] = useState(false);
  const [likesTimeData, setlikesTimeData] = useState([1, 2, 3]);


  const fetchAverageEngagement= async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/getAverageEngagement');
      setAverageLikes(data.averageLikes.toFixed(2));
      setAverageComments(data.averageComments.toFixed(2));
      setAverageSaves(data.averageSaves.toFixed(2));
      setAverageEngagement(data.averageEngagement.toFixed(2));
    } catch (error) {
      console.error('Error fetching average comments:', error);
    }
  };

  const fetchEngagementTimeData= async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/getEngagementTimeData');

      setlikesTimeData(data);
    } catch (error) {
      console.error('Error fetching average comments:', error);
    }
  };

  useEffect(() => {
    fetchAverageEngagement(null);
    fetchEngagementTimeData(null);
  }, []); 

  return (
    <div className={styles.userMetricsPage}>
      <div className={styles.topComponent}>
        <h1 className={styles.generalMetricsHeader}>General Metrics</h1>
        <p className={styles.topDescription}>
          This set of graphs provides an overview of user engagement over time. By analyzing various metrics, you can better understand how your content performs and identify opportunities for improvement.
        </p>
      </div>
      <button 
        className={styles['login-back-button']} 
        onClick={goToLogin} 
        title="Go back to Home page"
      >
        Back to Home
      </button>
      <div className={styles.graphContainer}>
        <div className={styles.description}>
          <h3>Average # of Likes Per Post: {averageLikes}</h3>
          <p>
            This graph visualizes the average number of likes your posts receive. Tracking likes is essential for understanding audience 
            engagement and the popularity of your content. The higher the like count, the better your content is resonating with your followers.
          </p>
        </div>
        <UserMetricsGraph data={likesTimeData} metric="like_count" />
      </div>
      <div className={styles.graphContainer}>
        <div className={styles.description}>
          <h3>Average # of Comments Per Post: {averageComments}</h3>
          <p>
            This graph shows the average number of comments per post. Comments represent a deeper level of engagement, offering valuable insights 
            into what your audience is thinking. A higher comment count can indicate stronger interaction and community involvement with your posts.
          </p>
        </div>
        <UserMetricsGraph data={likesTimeData} metric="comments_count" />
      </div>
      <div className={styles.graphContainer}>
        <div className={styles.description}>
          <h3>Average # of Saves Per Post: {averageSaves}</h3>
          <p>
            The average number of saves per post is displayed in this graph. Saves indicate that users found your content valuable enough to 
            revisit later, which is a key indicator of long-term interest in your content. Higher saves can lead to increased visibility in users’ feeds.
          </p>
        </div>
        <UserMetricsGraph data={likesTimeData} metric="saves" />
      </div>
      <div className={styles.graphContainer}>
        <div className={styles.description}>
          <h3>Average Total Engagement Per Post: {averageEngagement}</h3>
          <p>
            This graph calculates the total engagement per post, factoring in likes, comments, and saves. Total engagement provides a holistic view 
            of how your posts are performing and helps track overall user interaction. Optimizing for engagement is a surefire way to grow your online
            presence.
          </p>
        </div>
        <UserMetricsGraph data={likesTimeData} metric="total_engagement" />
      </div>
    </div>
  );  
}

export default UserMetrics;
