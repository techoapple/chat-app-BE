require('dotenv').config();

const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIO = require('socket.io');
const path = require('path');
const checkJwt = require('./middlewares/auth');
const { saveMessageToDynamoDB } = require('./controllers/chatController');

// Create an Express application
const app = express();

// Serve static files (HTML for public and private chat)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());  // Parse JSON request bodies

// Load SSL certificates for HTTPS
const options = {
  key: fs.readFileSync('/path/to/your/private-key.pem'),
  cert: fs.readFileSync('/path/to/your/certificate.pem')
};

// Create HTTPS server
const server = https.createServer(options, app);

// Initialize Socket.io for real-time communication
const io = socketIO(server);

// WebSocket JWT authentication
io.use((socket, next) => {
  const token = socket.handshake.query.token;
  checkJwt(token, (err) => {
    if (err) return next(new Error('Authentication error'));
    next();
  });
});

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('User connected with socket ID:', socket.id);

  socket.on('sendMessage', async (data) => {
    const { message, senderId, receiverId } = data;
    await saveMessageToDynamoDB(message, senderId, receiverId);
    io.emit('receiveMessage', data);  // Broadcast the message to all connected clients
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start HTTPS server on port 443
server.listen(443, () => {
  console.log('Secure server is running on port 443');
});
