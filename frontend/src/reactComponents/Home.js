import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../css/Home.module.css';
import LoadingPage from './reactUtils/LoadingPage.js';

function Home() {
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true); // Loading state to control rendering of data

  // Navigate to the hashtags page
  const goToHashTags = () => {
    navigate('/hashtags'); 
  };

  // Navigate to the user metrics page
  const goToUserMetrics = () => {
    navigate('/usermetrics'); 
  };

  // Navigate to the comments page
  const goToComments = () => {
    navigate('/comments'); 
  };

  // Navigate to the time-based metrics page
  const goToTimeBasedMetrics = () => {
    navigate('/timebasedmetrics'); 
  };

  // Navigate to the login page
  const goToLogin = () => {
    navigate('/'); 
  };

  // Fetch data before rendering (currently no actual data fetch, just set loading to false)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(false); // Set loading to false once data is (hypothetically) fetched
    };
    fetchData();
  }, []); // Empty dependency array to run only on component mount

  // Show loading message while data is being fetched
  if (loading) {
    return <LoadingPage />; // Show the loading page until data is ready
  }

  return (
    <div style={{ backgroundColor: "#e0d4fa", minHeight: "100vh", width: "100vw" }}>
      <div className={styles['home-box']}>
        <header>
          <h1 className={styles.generalMetricsHeader}>Home Page</h1> {/* Display the page title */}
        </header>      
        <button 
          className={styles['login-back-button']} 
          onClick={goToLogin} 
          title="Go back to login page"
        >
          Back to Login {/* Button to go back to the login page */}
        </button>
    
        <div className={styles['home-container']}>
          {/* Button to navigate to user metrics page */}
          <button 
            className={styles['home-button']} 
            onClick={goToUserMetrics} 
            title="View user metrics such as followers and engagement."
          >
            User Metrics
          </button>
          {/* Button to navigate to hashtags analysis page */}
          <button 
            className={styles['home-button']} 
            onClick={goToHashTags} 
            title="Analyze hashtags and their effectiveness."
          >
            Hashtags
          </button>
          {/* Button to navigate to comments analysis page */}
          <button 
            className={styles['home-button']} 
            onClick={goToComments} 
            title="See comments on posts and analyze sentiment."
          >
            Comments
          </button>
          {/* Button to navigate to time-based metrics page */}
          <button 
            className={styles['home-button']} 
            onClick={goToTimeBasedMetrics} 
            title="View time-based metrics like post engagement over time."
          >
            Time-Based Metrics
          </button>
        </div>
      </div>
    </div>
  );  
}

export default Home;
