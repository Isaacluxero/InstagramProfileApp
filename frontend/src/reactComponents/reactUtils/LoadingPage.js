import React from 'react';

const LoadingPage = () => {
  const styles = {
    loadingPage: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#e0d4fa', // Light purple background
      borderRadius: '15px',
      padding: '20px',
      textAlign: 'center',
    },
    spinner: {
      width: '50px',
      height: '50px',
      border: '5px solid rgba(255, 255, 255, 0.3)',
      borderTop: '5px solid #6a5acd', // Soft purple
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      marginBottom: '20px',
    },
    loadingText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
      backgroundColor: '#f4f4f4',
      padding: '10px 20px',
      borderRadius: '10px',
      boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    keyframes: `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `,
  };

  return (
    <div style={styles.loadingPage}>
      <style>{styles.keyframes}</style>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Loading insights... Please wait</p>
    </div>
  );
};

export default LoadingPage;
