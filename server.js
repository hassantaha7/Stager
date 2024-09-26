// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow connections from any origin for testing
  },
});

let waitingPlayer = null; // Track the waiting player
let gameState = {
  currentPlayerIndex: 0,
  player1Score: 0,
  player2Score: 0,
  currentTurnId: null, // Track which player’s turn it is
};

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Handle when a player clicks "Play Online"
  socket.on('joinGame', () => {
    if (!waitingPlayer) {
      // No waiting player, so this player waits for an opponent
      waitingPlayer = socket;
      socket.emit('waitingForOpponent'); // Inform the player that they are waiting
    } else {
      // Match found: start the game
      const player1 = waitingPlayer;
      const player2 = socket;
      waitingPlayer = null; // Clear the waiting player

      // Set initial game state
      gameState.currentTurnId = player1.id;

      // Notify both players to start the game
      player1.emit('startGame', { yourTurn: true, opponentId: player2.id });
      player2.emit('startGame', { yourTurn: false, opponentId: player1.id });
    }
  });

  // Updated playerAnswered event handler
  socket.on('playerAnswered', (data) => {
    // Update game state with the new information
    gameState = {
      ...gameState,
      currentPlayerIndex: data.currentPlayerIndex,
      player1Score: data.player1Score,
      player2Score: data.player2Score,
      currentTurnId: data.nextTurnId,
    };

    // Broadcast the updated state to both players
    io.emit('updateGame', gameState);
  });


  // Handle player disconnection
  socket.on('disconnect', () => {
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null; // Clear the waiting player if they disconnect
    }
    console.log(`Player disconnected: ${socket.id}`);
    io.emit('playerDisconnected', `Player disconnected`);
  });
});

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3001');
});
