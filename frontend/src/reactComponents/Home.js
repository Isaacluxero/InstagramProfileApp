import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../css/Home.module.css';

function Home() {
  const navigate = useNavigate(); 

  // Navigate to hashtags page 
  const goToHashTags = () => {
    navigate('/hashtags'); 
  };

  // Navigate to user metrics page 
  const goToUserMetrics = () => {
    navigate('/usermetrics'); 
  };

  const goToComments = () => {
    navigate('/comments'); 
  };

  const goToLogin = () => {
    navigate('/'); 
  };


  return (
    <div className={styles['home-box']}>
      <header className={styles['home-header']}>
        <h1>Home Page</h1>
      </header>
      
      {/* Back to Login Button in Top-Left Corner */}
      <button 
        className={styles['login-back-button']} 
        onClick={goToLogin} 
        title="Go back to login page"
      >
        Back to Login
      </button>

      <div className={styles['home-container']}>
        <button 
          className={styles['home-button']} 
          onClick={goToUserMetrics} 
          title="View user metrics such as followers and engagement."
        >
          User Metrics
        </button>
        <button 
          className={styles['home-button']} 
          onClick={goToHashTags} 
          title="Analyze hashtags and their effectiveness."
        >
          Hashtags
        </button>
        <button 
          className={styles['home-button']} 
          onClick={goToComments} 
          title="See comments on posts and analyze sentiment."
        >
          Comments
        </button>
        <button 
          className={styles['home-button']} 
          onClick={goToComments} 
          title="View time-based metrics like post engagement over time."
        >
          Time-Based Metrics
        </button>
      </div>
    </div>
  );
}

export default Home;
