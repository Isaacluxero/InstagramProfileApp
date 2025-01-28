import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/Home.css';

function Home() {
  const navigate = useNavigate(); 

  // Navigate to hashtags page 
  const goToHashTags = () => {
    navigate('/hashtags'); 
  };

  // Navigate to hashtags page 
  const goToUserMetrics = () => {
    navigate('/usermetrics'); 
  };

  return (
    <div className="home">
      <h1>Home Page</h1>
      <button onClick={goToUserMetrics}>
        Go to User Metrics Page
      </button>
      <button onClick={goToHashTags}>
      Go to Hash-Tags Page
    </button>
    </div>
  );
}

export default Home;

