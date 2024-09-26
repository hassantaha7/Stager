// src/components/Scoreboard.js
import React from 'react';


const Scoreboard = ({ player1Score }) => {
  return (
    <div className="scoreboard">
      <span className="score">Score: {player1Score}</span>
    </div>
  );
};

export default Scoreboard;
