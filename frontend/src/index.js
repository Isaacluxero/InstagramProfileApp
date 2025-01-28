import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure the Facebook SDK is initialized before mounting the React app
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);

  // Check if Facebook SDK is initialized before rendering the app
  window.fbAsyncInit = () => {
    console.log('Facebook SDK Initialized');
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  };
} else {
  console.error('Root element not found');
}

