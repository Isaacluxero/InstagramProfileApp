import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function UserMetricsGraph({data, metric}) {
    var dataFormatted = formatDataTimestamps(data);
    const dynamicHeader = getDynamicHeader(metric);

    return (
      <div style={{ width: '70vw', height: '50vh', margin: '0 auto' }}> {/* Increased width and height */}
        <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '10px' }}>
          {dynamicHeader} Over Time
        </h3>      
        <ResponsiveContainer width="100%" height="80%"> {/* Fills the parent div */}
          <LineChart data={dataFormatted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={metric} stroke="#8884d8" activeDot={{ r: 8 }} name={dynamicHeader}/>
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
}

function formatDataTimestamps(dataArray) {
  return dataArray.map(entry => {
    try {
      if (!entry.timestamp) {
        // If timestamp is null or undefined, set it to null (or you can choose an empty string)
        return { ...entry, timestamp: null };
      }
      return {
        ...entry,
        timestamp: new Date(entry.timestamp).toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Error processing entry:', entry);
      console.error('Error message:', error.message);
      return entry; // Return the original entry if an error occurs
    }
  });
}


function getDynamicHeader(metricType) {
  let header;
  switch (metricType) {
    case 'like_count':
      header = "Likes";
      break;
    case 'comments_count':
      header = "Comments";
      break;
    case 'saves':
      header = "Saves";
      break;
    case 'total_engagement':
      header = "Total Engagement";
      break;
    case 'hashtag_count':
      header = "Hashtag";
      break;
    default:
      header = "General Metrics";
      break;
  }
  return header;
}

export default UserMetricsGraph;
