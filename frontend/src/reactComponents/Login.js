import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom'; 
import styles from '../css/Login.module.css';
import instagramLogo from '../css/images/instagramLogo.jpeg';

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
          storeInstaUserInfo(data.instagram_business_account.id, accessToken, pageId);
        } 
      });
  };

  return (
    <div className={styles.loginPage}>
      <header className={styles.loginHeader}>
        <div className={styles.boxWrapper}>
          <img src={instagramLogo} alt="Instagram Logo" className={styles.logo} />
          <h1>Instagram Profile Analyzer</h1>
        </div>
      </header>
      <p className={styles.description}>
        Analyze your Instagram profile to boost engagement and optimize content strategies.
      </p>
      <div className={styles.loginContainer}>
        {!isLoggedIn ? (
          <button className={styles.loginButton} onClick={handleFacebookLogin}>
            Login with Facebook
          </button>
        ) : (
          <h3 className={styles.redirectMessage}>Redirecting to Homepage...</h3>
        )}
        <p className={styles.italicsDescription}>
        * Note: In order to login a Instagram business account with a linked Facebook account is needed.
      </p>
      </div>
    </div>
  );
};

export default Login;