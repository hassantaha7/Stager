// src/components/MainMenu.js
import React from 'react';
import '../styles/MainMenu.css'; // Ensure you have the styles linked

const MainMenu = ({ onStartGame }) => {
  return (
    <div className="main-menu">
      <img src="stager-logo.jpg" alt="Stager Logo" className="main-menu-logo" />
      <div className="menu-buttons-container">
        <button className="menu-button" onClick={() => onStartGame('online')}>
          Play Online
        </button>
        <button className="menu-button" onClick={() => onStartGame('friends')}>
          Play with Friends
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
