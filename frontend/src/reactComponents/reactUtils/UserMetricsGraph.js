import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function UserMetricsGraph({ data, metric }) {
  // Sort data chronologically before formatting timestamps
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return dateA - dateB;
  });

  var dataFormatted = formatDataTimestamps(sortedData);
  const dynamicHeader = getDynamicHeader(metric);

  return (
    <div style={{ width: '70vw', height: '50vh', margin: '0 auto' }}> {/* Increased width and height */}
      <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '10px' }}>
        {dynamicHeader} Over Time
      </h3>
      <ResponsiveContainer width="100%" height="80%"> {/* Fills the parent div */}
        <LineChart data={dataFormatted}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 12, fill: '#666' }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
          />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc',
              borderRadius: '5px',
              padding: '10px'
            }}
            labelStyle={{ fontWeight: 'bold', color: '#666' }}
          />
          <Legend />
          <Line type="monotone" dataKey={metric} stroke="#8884d8" activeDot={{ r: 8 }} name={dynamicHeader} />
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
      const date = new Date(entry.timestamp);
      return {
        ...entry,
        timestamp: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
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
