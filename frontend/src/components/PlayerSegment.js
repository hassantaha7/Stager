// src/components/PlayerSegment.js
import React, { useState, useEffect } from 'react';
import { players } from '../data/players'; // Import player data
import '../styles/PlayerSegment.css'; // Add styling as needed

const PlayerSegment = ({ onScore, currentQuestionIndex, yourTurn, onAnswered }) => {
  const [currentPlayer, setCurrentPlayer] = useState(players[currentQuestionIndex]);
  const [answer, setAnswer] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Update the current player based on the current question index
    setCurrentPlayer(players[currentQuestionIndex]);
  }, [currentQuestionIndex]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setAnswer(input);

    if (input.length > 0) {
      const filteredPlayers = players.filter((player) =>
        player.name.toLowerCase().startsWith(input.toLowerCase())
      );
      setSuggestions(filteredPlayers);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (name) => {
    setAnswer(name);
    setSuggestions([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (answer.toLowerCase() === currentPlayer.name.toLowerCase()) {
      setMessage(`Correct! ${currentPlayer.name}`);
      onScore(currentQuestionIndex % 2 === 0 ? 1 : 2); // Alternate score assignment
    } else {
      setMessage("Wrong answer! Next player's turn.");
    }
    setAnswer('');
    
    // Notify that the turn is complete
    onAnswered();
  
    // Clear the message immediately after the answer is submitted
    setTimeout(() => {
      setMessage('');
    }, 1000); // Adjust the delay time as needed (in milliseconds)
  };
  

  return (
    currentPlayer && (
      <div className="player-segment">
        <h2>Guess the Player</h2>
        <p>Current Turn: {yourTurn ? 'Your turn' : 'Waiting for opponent...'}</p>
        <p className='journey'>{currentPlayer.journey.join(' ➔ ')}</p>
        {yourTurn ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={answer}
              onChange={handleInputChange}
              placeholder="Type the player's name..."
              className="input"
            />
            <button type="submit" className="tick-button" title="Submit Answer">
              ✓
            </button>
          </form>
        ) : (
          <p>Waiting for the other player...</p>
        )}

        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion.name)}
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}

        <p>{message}</p>
      </div>
    )
  );
};

export default PlayerSegment;
