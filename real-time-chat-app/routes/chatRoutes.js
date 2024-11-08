const express = require('express');
const { saveMessageToDynamoDB, getMessages } = require('../controllers/chatController');
const checkJwt = require('../middlewares/auth');

const router = express.Router();

// Route for sending messages
router.post('/send', checkJwt, async (req, res) => {
  const { message, senderId, receiverId } = req.body;

  // Save the message to DynamoDB
  await saveMessageToDynamoDB(message, senderId, receiverId);
  res.status(200).json({ message: 'Message sent successfully!' });
});

// Route for retrieving messages between two users
router.get('/messages/:senderId/:receiverId', checkJwt, async (req, res) => {
  const { senderId, receiverId } = req.params;

  const messages = await getMessages(senderId, receiverId);
  res.status(200).json(messages);
});

module.exports = router;
