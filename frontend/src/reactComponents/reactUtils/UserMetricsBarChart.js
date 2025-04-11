import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
      const { label, count, avgScore } = payload[0].payload;

      // Ensure avgScore is a valid number, convert it to string, and slice the first 4 characters
      const safeAvgScore = isNaN(avgScore) ? "0" : avgScore.toString().slice(0, 4); // Slice first 4 characters

      return (
          <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
              <p style={{ margin: 0 }}>Count: {count}</p>
              <p style={{ margin: 0 }}>Avg Score: {safeAvgScore}</p>
          </div>
      );
  }
  return null;
};



const UserMetricsBarChart = ({ data, metric }) => {
    const header = getDynamicHeader(metric);

    return ( 
        <div style={{ width: '70vw', height: '60vh', margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '60px' }}>{header}</h3>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data} margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey={metric} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" name="Comment Count" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

function getDynamicHeader(metricType) {
    switch (metricType) {
        case 'label':
            return "Positive Vs Negative Analysis Results";
        case 'emotion':
            return "Sentiment Analysis Results";
        case 'hashtag':
            return "Top 5 Most Used Hashtags";
        default:
            return "General Metrics";
    }
}

export default UserMetricsBarChart;

