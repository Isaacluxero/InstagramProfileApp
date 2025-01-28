import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BusinessInstagramProvider } from './reactComponents/BusinessInstagramContext';
import Login from './reactComponents/Login';
import Home from './reactComponents/Home';
import HashTags from './reactComponents/HashTags';
import UserMetrics from './reactComponents/UserMetrics';
import './css/App.css';

function App() {
  return (
    <BusinessInstagramProvider> 
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/usermetrics" element={<UserMetrics/>} />
            <Route path="/hashtags" element={<HashTags/>} />
          </Routes>
        </div>
      </Router>
    </BusinessInstagramProvider>
  );
}

export default App;
