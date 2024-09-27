// src/components/Game.js
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import LoadingPage from './LoadingPage';
import MainMenu from './MainMenu';
import PlayerSegment from './PlayerSegment';
import Scoreboard from './Scoreboard';
import '../styles/Game.css';

const socket = io("https://stager-server.vercel.app/", {
  transports: ["websocket", "polling"], // Attempt WebSocket first, fallback to polling
  reconnectionAttempts: 5, // Number of reconnection attempts before failing
  timeout: 5000, // Connection timeout duration
  autoConnect: true, // Automatically attempt to reconnect
});


const Game = () => {
  const [stage, setStage] = useState('menu'); // Start with the main menu
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [opponentFound, setOpponentFound] = useState(false);
  const [yourTurn, setYourTurn] = useState(false);
  const [playerMessage, setPlayerMessage] = useState('');
  const [currentSegment, setCurrentSegment] = useState(1);
  const [opponentId, setOpponentId] = useState('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0); // Track the current question index

  useEffect(() => {
    // Handle when the game starts
    socket.on('startGame', ({ yourTurn, opponentId }) => {
      setOpponentFound(true);
      setYourTurn(yourTurn);
      setOpponentId(opponentId);
      setStage('playing');
    });

    // Show waiting message when no opponent is found yet
    socket.on('waitingForOpponent', () => {
      setPlayerMessage('Waiting for an opponent...');
      setStage('loading'); // Keep showing the loading screen
    });

    // Update game state when turn changes
    socket.on('updateGame', (data) => {
      setYourTurn(socket.id === data.currentTurnId);
      setCurrentPlayerIndex(data.currentPlayerIndex);
      setPlayer1Score(data.player1Score);
      setPlayer2Score(data.player2Score);
    });

    // Handle player disconnection updates
    socket.on('playerDisconnected', () => {
      alert('The other player disconnected. Game over.');
      setStage('menu');
    });

    return () => {
      socket.off('startGame');
      socket.off('waitingForOpponent');
      socket.off('updateGame');
      socket.off('playerDisconnected');
    };
  }, []);

  const handleStartGame = () => {
    setStage('loading'); // Redirect to loading screen
    socket.emit('joinGame'); // Request to join the game
  };

  const handleScore = (player) => {
    let updatedPlayer1Score = player1Score;
    let updatedPlayer2Score = player2Score;

    if (player === 1) {
      updatedPlayer1Score = player1Score + 1;
      setPlayer1Score(updatedPlayer1Score);
    } else {
      updatedPlayer2Score = player2Score + 1;
      setPlayer2Score(updatedPlayer2Score);
    }

    const updatedData = {
      yourTurn: !yourTurn,
      currentPlayerIndex: currentPlayerIndex + 1,
      player1Score: updatedPlayer1Score,
      player2Score: updatedPlayer2Score,
      nextTurnId: yourTurn ? opponentId : socket.id,
    };

    socket.emit('playerAnswered', updatedData);
  };

  return (
    <div className="game-container">
      {stage === 'loading' && <LoadingPage message={playerMessage} />}
      {stage === 'menu' && <MainMenu onStartGame={handleStartGame} />}
      {stage === 'playing' && opponentFound && (
        <div className="game-layout">
          <div className="player player-north">
            <p className='name'>Player 2</p>
            <Scoreboard player1Score={player2Score} />
          </div>
          <PlayerSegment
            onScore={handleScore}
            currentQuestionIndex={currentPlayerIndex}
            yourTurn={yourTurn}
            onAnswered={() => {}}
          />
          <div className="player player-south">
            <p className='name'>Player 1</p>
            <Scoreboard player1Score={player1Score} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
