import React, { useState, useEffect } from 'react';
import styles from '../css/Comments.module.css';
import axios from 'axios';
import UserMetricsBarChart from './reactUtils/UserMetricsBarChart.js';
import LoadingPage from './reactUtils/LoadingPage.js';

function Comments() {
  const [commentsClassified, setCommentsClassified] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true); // State to handle loading status
  const [emotionData, setEmotionData] = useState(null);

  // Fetch classified comments (positive, negative, neutral)
  const getcommentsClassified = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/getCommentsClassified');
      setCommentsClassified(data.result);
      setRecommendation(getRecommendation(data.result)); 
    } catch (error) {
      console.error('Error fetching classified comments:', error);
    }
  };

  // Fetch comment sentiment data (emotions: joy, sadness, etc.)
  const getcommentsCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3002/predict');
      setEmotionData(organizeEmotions(response.data));
      console.log(organizeEmotions(response.data));
    } catch (error) {
      console.error('Error fetching emotion data:', error);
    }
  };
  
  // UseEffect hook to fetch data when the component mounts
  useEffect(() => {
    getcommentsClassified(); // Fetch classified comments
    getcommentsCategories(); // Fetch emotion categories
  }, []);

  // UseEffect hook to handle the loading state after fetching all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(false); // Once data is fetched, set loading state to false
    };
    fetchData();
  }, []);

  // Show loading screen while fetching data
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className={styles.commentsPage}>
      <h1 className={styles.title}>Comments Page</h1>
    
      <div className={styles.topDescription}>
        The Comments Analysis Dashboard provides insights into user engagement by analyzing the sentiment of comments across all posts. 
        Use this dashboard to identify trends, improve content strategy, and boost audience engagement! 🚀
      </div>
      
      {/* Graph showing the positive vs negative comments */}
      <div className={styles.graphContainer}>
        <div className={styles.description}>
          <h3>Positive Vs Negative Comments</h3>
          <p>
            This graph displays the sentiment of all the comments from all posts, being divided into positive, negative, and neutral sentiment. 
            Negative comments would be characterized as hate comments, while positive comments would be supportive.
          </p>
          <div className={styles.feedbackBox}>
            <strong>Our Feedback:</strong>
            <p>{recommendation}</p> {/* Display feedback based on classified comments */}
          </div>
        </div>
        <UserMetricsBarChart data={commentsClassified} metric={'label'} /> {/* Bar chart showing classified comments */}
      </div>

      {/* Graph showing the overall sentiment of all comments */}
      <div className={styles.graphContainer}>
        <div className={styles.description}>
          <h3>Overall Sentiment of Comments</h3>
          <p>
            This graph displays the overall sentiment of all the comments from all posts. It has been divided into positive, negative, and neutral sentiment.
          </p>
          <div className={styles.feedbackBox}>
            <strong>Our Feedback:</strong>
            <p>{generateRecommendation(emotionData)}</p> {/* Generate and display recommendation based on emotion data */}
          </div>
        </div>
        <UserMetricsBarChart data={emotionData} metric={'emotion'} /> {/* Bar chart showing emotions */}
      </div>
    </div>
  );
}

// Generate a recommendation based on classified comments (positive, negative, neutral)
function getRecommendation(data) {
  if (!Array.isArray(data) || data.length === 0) {
    return "No data available to provide recommendations.";
  }

  const positive = data.find(d => d.label === "POSITIVE") || { count: 0 };
  const negative = data.find(d => d.label === "NEGATIVE") || { count: 0 };
  const neutral = data.find(d => d.label === "NEUTRAL") || { count: 0 };

  const totalComments = positive.count + negative.count + neutral.count;
  
  if (totalComments === 0) {
    return "No comments analyzed. Try gathering more engagement.";
  }

  const posPercent = (positive.count / totalComments) * 100;
  const negPercent = (negative.count / totalComments) * 100;
  const neuPercent = (neutral.count / totalComments) * 100;

  // Recommendation logic based on percentages of positive, negative, and neutral comments
  if (posPercent > 60) {
    return "Great engagement! Keep up the positive content and interact more with your audience.";
  } else if (negPercent > 50) {
    return "There is significant negative sentiment. Consider addressing concerns, improving content, or engaging with users for feedback.";
  } else if (neuPercent > 50) {
    return "Most comments are neutral. Try creating more engaging and emotionally resonant content.";
  } else if (Math.abs(positive.count - negative.count) <= 5) {
    return "Positive and negative sentiments are almost equal. This suggests a polarizing topic—engage with users to understand their perspectives.";
  } else if (Math.abs(positive.count - neutral.count) <= 5) {
    return "Positive and neutral comments are close. Encourage more interaction to turn neutrals into positives.";
  } else if (Math.abs(negative.count - neutral.count) <= 5) {
    return "Negative and neutral comments are close in number. Try adjusting your content strategy to shift sentiment in a positive direction.";
  } else {
    return "Mixed sentiment detected. Keep monitoring engagement and adjust your content accordingly.";
  }
}

// Generate recommendations based on emotions detected in comments
function generateRecommendation(emotionsData) {
  if (!Array.isArray(emotionsData) || emotionsData.length === 0) {
    return "No emotions detected. Try engaging more with your audience.";
  }

  const maxCount = Math.max(...emotionsData.map(entry => entry.count)); // Find the highest emotion count
  const dominantEmotions = emotionsData.filter(entry => entry.count === maxCount).map(entry => entry.emotion);

  // Define recommendations based on dominant emotions
  const recommendations = {
    "joy": "Your audience is happy! Keep up the good work with engaging content.",
    "sadness": "Your audience seems sad. Consider posting uplifting content or motivational messages.",
    "anger": "Your content is provoking strong reactions. Consider addressing concerns or engaging in a discussion.",
    "fear": "Your audience is feeling anxious. Try providing reassurance or informative content.",
    "surprise": "Your audience is surprised! Use this momentum to keep them engaged with exciting updates.",
    "disgust": "Your audience has negative reactions. Review your content strategy to ensure it aligns with their expectations."
  };

  // Generate response based on dominant emotions
  let response;
  if (dominantEmotions.length === 1) {
    response = recommendations[dominantEmotions[0]] || "Keep monitoring your audience's reactions!";
  } else {
    response = "Your audience has mixed reactions. Consider diversifying your content to cater to different emotions.";
  }

  return response;
}

// Organize emotion data from the API response
function organizeEmotions(emotions) {
  const emotionCounts = {};
  emotions.forEach(emotion => {
    emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
  });

  return Object.entries(emotionCounts).map(([emotion, count]) => ({
    emotion,
    count
  }));
}

export default Comments;
