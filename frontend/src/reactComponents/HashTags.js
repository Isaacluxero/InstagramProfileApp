import React, { useContext, useState, useEffect } from 'react';
import { BusinessInstagramContext } from './BusinessInstagramContext';

function HashTags() {
  const { businessInstagramId } = useContext(BusinessInstagramContext);
  const [averageHashtags, setAverageHashtags] = useState(null);
  const [topHashtags, setTopHashtags] = useState(null);
  const [hashtagCategories, setHashtagCategories] = useState(null);


  // Gets average amount of hashtags used per post
  const getAverageHashtags = async () => {
    const data = { instaUserId: businessInstagramId };
    try {
      const response = await fetch('http://localhost:5001/calculateAverageHashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setAverageHashtags(result.average);
    } catch (error) {
      console.error('Error fetching average hashtags:', error);
    }
  };

    // Gets average amount of hashtags used per post
    const getHashtagCategories = async () => {
      const data = { instaUserId: businessInstagramId };
      try {
        const response = await fetch('http://localhost:5001/getHashTagCategories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log(result);
        setHashtagCategories(result.average);
      } catch (error) {
        console.error('Error fetching average hashtags:', error);
      }
    };
  // Gets five most used hashtags
  const getTopFiveHashTags = async () => {
    const data = { instaUserId: businessInstagramId };
    try {
      const response = await fetch('http://localhost:5001/getTopHashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);
      setTopHashtags(result.result.hashtag);
    } catch (error) {
      console.error('Error fetching average hashtags:', error);
    }
  };

  useEffect(() => {
    setAverageHashtags(null);
    setTopHashtags(null);
    setHashtagCategories(null);
    if (businessInstagramId) {
      getAverageHashtags();
      getTopFiveHashTags();
      getHashtagCategories();
    }
  }, [businessInstagramId]);

  return (
    <div>
      <h1>HashTags Page</h1>
      <p>
        Average Hashtags Per Post: {averageHashtags !== null ? averageHashtags.toFixed(2) : 'Loading...'}
      </p>
      <p>Most Common Hash-tags: {topHashtags}</p>
      <p>Hashtag Categories: {hashtagCategories}</p>
      <p>Business Instagram ID: {businessInstagramId}</p>
    </div>
  );
}

export default HashTags;


