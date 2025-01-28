import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../css/App.css';
import { BusinessInstagramContext } from './BusinessInstagramContext'; 

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { businessInstagramId, setBusinessInstagramId } = useContext(BusinessInstagramContext);

  const navigate = useNavigate(); 

  // Handle Facebook Login
  const handleFacebookLogin = () => {
    window.FB.login(
      (response) => {
        if (response.authResponse) {
          console.log('Logged in successfully', response);
          setIsLoggedIn(true);
          fetchInstagramBusinessAccount(response.authResponse.accessToken);
          navigate('/home'); 
        } else {
          console.log('User cancelled login or did not fully authorize' + response);
        }
      },
      { scope: 'email,pages_show_list,instagram_basic,instagram_manage_insights,pages_read_engagement' }
    );
  };

  // Store data for user for other api's
  const storeInstaUserInfo = (instaUserId, accessToken) => {  
    const stringData = { 
      userId: instaUserId,
      accessToken: accessToken,
     }; 
    fetch('http://localhost:5001/storeData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stringData), 
    })
      .then(response => response.json()) 
      .then(response => console.log('Data saved successfully:', response))
      .catch((error) => console.error('Error:', error));
  };

  // Retrieve instagram user id
  const fetchInstagramBusinessAccount = (accessToken) => {
    const pageId = '189092345349341'; // Your Facebook Page ID
    const url = `https://graph.facebook.com/v15.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.instagram_business_account) {
          setBusinessInstagramId(data.instagram_business_account.id);
          storeInstaUserInfo(data.instagram_business_account.id, accessToken, pageId);
        } 
      });
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <h1>Instagram Profile Analyzer</h1>
      </header>
      <div className="login-container">
        {!isLoggedIn ? (
          <button className="login-button" onClick={handleFacebookLogin}>
            Login with Facebook
          </button>
        ) : (
          <h3 className="redirect-message">Redirecting to Homepage...</h3>
        )}
      </div>
    </div>
  );
}

export default Login;
