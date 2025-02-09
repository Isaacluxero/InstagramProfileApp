import React, { useContext, useState, useEffect } from 'react';
import { BusinessInstagramContext } from './BusinessInstagramContext';

function Comments() {
  const { businessInstagramId } = useContext(BusinessInstagramContext);
  const [topCommenter, setTopCommenter] = useState(null);

  // Gets average amount of hashtags used per post
  const getTopCommenter = async () => {
    const data = { instaUserId: businessInstagramId };
    try {
      const response = await fetch('http://localhost:5001/getTopCommenter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      setTopCommenter(result.result.username);
    } catch (error) {
      console.error('Error fetching average hashtags:', error);
    }
  };

  useEffect(() => {
    getTopCommenter(null);
    if (businessInstagramId) {
      getTopCommenter();
    }
  }, [businessInstagramId]);

  return (
    <div>
      <h1>Comments Page</h1>
      <p>Most Common Hash-tags: {topCommenter}</p>
    </div>
  );
}

export default Comments;