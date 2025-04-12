import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './reactComponents/Login.js';
import Home from './reactComponents/Home.js';
import HashTags from './reactComponents/HashTags.js';
import UserMetrics from './reactComponents/UserMetrics.js';
import Comments from './reactComponents/Comments.js';
import TimeBasedMetrics from './reactComponents/TimeBasedMetrics.js';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/hashtags" element={<HashTags />} />
          <Route path="/usermetrics" element={<UserMetrics />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/timebasedmetrics" element={<TimeBasedMetrics />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
