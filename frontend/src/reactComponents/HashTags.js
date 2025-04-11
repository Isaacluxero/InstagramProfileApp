import React, { useContext, useState, useEffect } from 'react';
import styles from '../css/HashTags.module.css';
import UserMetricsGraph from './reactUtils/UserMetricsGraph.js';
import UserMetricsBarChart from './reactUtils/UserMetricsBarChart.js';
import Tabs from './reactUtils/Tabs.js';
import LoadingPage from './reactUtils/LoadingPage.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function HashTags() {
  const navigate = useNavigate(); 
  const goToLogin = () => {
    navigate('/home'); // Navigate to the home page
  };

  const [averageHashtags, setAverageHashtags] = useState(null); // State to store average hashtags per post
  const [topHashtags, setTopHashtags] = useState(null); // State to store top hashtags
  const [hashtagCategories, setHashtagCategories] = useState(null); // State to store categories of hashtags
  const [hashtagCategoriesAverages, setHashtagCategoriesAverages] = useState(null); // State to store averages of hashtag categories
  const [hashtagTimeData, setHashtagTimeData] = useState(null); // State to store hashtag time data
  const [loading, setLoading] = useState(true); // Loading state to control when data is fetched

  // Fetch hashtag time data
  const fetchHashtagsTimeData = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/getHashtagsTimeData');
      setHashtagTimeData(data); // Set the fetched time data for hashtags
    } catch (error) {
      console.error('Error fetching average hashtags:', error); // Log error if API call fails
    }
  };

  // Fetch average hashtags data
  const getAverageHashtags = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/calculateAverageHashtags');
      setAverageHashtags(data.average); // Set the average number of hashtags per post
    } catch (error) {
      console.error('Error fetching average hashtags:', error); // Log error if API call fails
    }
  };

  // Fetch hashtag categories and their averages
  const getHashtagCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/getHashTagCategories');
      setHashtagCategories(data.result.hashtagCategories); // Set the categories of hashtags
      setHashtagCategoriesAverages(data.result.categoryAverages); // Set the averages for each hashtag category
    } catch (error) {
      console.error('Error fetching hashtag categories:', error); // Log error if API call fails
    }
  };

  // Fetch the top 5 hashtags for the business Instagram user
  const getTopFiveHashTags = async () => {
    const data = { instaUserId: businessInstagramId }; // Prepare the data with the user ID
    try {
      const response = await fetch('http://localhost:5001/getTopHashtags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data), // Send the user data to fetch top hashtags
      });
      const result = await response.json();
      setTopHashtags(result.result.topHashtags); // Set the top hashtags
    } catch (error) {
      console.error('Error fetching top hashtags:', error); // Log error if API call fails
    }
  };

  // Fetch all the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await fetchHashtagsTimeData(); // Fetch hashtag time data
      await getAverageHashtags(); // Fetch average hashtags data
      await getTopFiveHashTags(); // Fetch top hashtags data
      await getHashtagCategories(); // Fetch hashtag categories and averages
      setLoading(false); // Set loading to false once all data is fetched
    };
    fetchData();
  }, []);

  // Show loading message while data is being fetched
  if (loading) {
    return <LoadingPage />; // Show loading page component while data is being fetched
  }

  return (
    <div className={styles.hashTagsPage}>
      <h1 className={styles.generalMetricsHeader}>Hashtags</h1>
      <button 
        className={styles['login-back-button']} 
        onClick={goToLogin} 
        title="Go back to Home page">
        Back to Home
      </button>
      
      {/* Display Average Hashtags Per Post */}
      <div className={styles.graphContainer}>
        <div className={styles.description}>
          <h3>Average # of Hashtags Per Post: {averageHashtags ? averageHashtags.toFixed(2) : "N/A"}</h3>
          <p>
            This graph calculates the total engagement per post, factoring in likes, comments, and saves. 
            Total engagement provides a holistic view of how your posts are performing and helps track overall user interaction. 
            Optimizing for engagement is a surefire way to grow your online presence.
          </p>
        </div>
        <UserMetricsGraph data={hashtagTimeData} metric="hashtag_count" /> {/* Render graph for hashtag counts over time */}
      </div>  
      
      {/* Display Top Hashtags Used */}
      <div className={styles.graphContainer}>
        <div className={styles.description}>
          <h3>Top Hashtags Used</h3>
          <p>
            This graph displays the most frequently used hashtags in your posts. Understanding your most used hashtags can help you optimize your strategy 
            for better reach and engagement.
          </p>
        </div>
        {topHashtags ? <UserMetricsBarChart data={topHashtags} metric={'hashtag'} /> : <LoadingPage />} {/* Display top hashtags chart or loading page */}
      </div >

      {/* Display Categories of Hashtags */}
      <div className={styles.graphContainer} style={{ marginTop: '0px', marginBottom:'300px' }}>
        <div className={styles.description}>
          <h3>Categories of Hashtags</h3>
          <p>
            This graph displays the most frequently used hashtags in your posts. Understanding your most used hashtags can help you optimize your strategy 
            for better reach and engagement.
          </p>
        </div>
        <Tabs data={hashtagCategories} averages={hashtagCategoriesAverages} /> {/* Display hashtag categories in tabs */}
      </div>
    </div>
  );
}

export default HashTags;
