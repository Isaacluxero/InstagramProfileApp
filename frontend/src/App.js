import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './reactComponents/Login';
import Home from './reactComponents/Home';
import HashTags from './reactComponents/HashTags';
import UserMetrics from './reactComponents/UserMetrics';
import Comments from './reactComponents/Comments';
import TimeBasedMetrics from './reactComponents/TimeBasedMetrics';

function App() {
  return (
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/usermetrics" element={<UserMetrics/>} />
            <Route path="/hashtags" element={<HashTags/>} />
            <Route path="/comments" element={<Comments/>} />
            <Route path="/timebasedmetrics" element={<TimeBasedMetrics />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
