// src/components/LoadingPage.js
import React from 'react';
import '../styles/LoadingPage.css';

const LoadingPage = ({ message }) => {
  return (
    <div className="loading-page">
      <img src="stager-logo.jpg" alt="Stager Logo" className="loading-logo" height={150} width={150} />
      <p className="loading-message">{message || 'Waiting...'}</p>
    </div>
  );
};

export default LoadingPage;
