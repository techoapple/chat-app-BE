const AWS = require('aws-sdk');

// Initialize DynamoDB DocumentClient
const dynamoDB = new AWS.DynamoDB.DocumentClient({
  region: 'your-region',  // Replace with your AWS region
});

// DynamoDB Table Name
const TABLE_NAME = 'ChatMessages';

// Save message to DynamoDB
async function saveMessage(message, senderId, receiverId) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      messageId: new Date().getTime().toString(),  // Unique message ID
      senderId: senderId,
      receiverId: receiverId,
      message: message,
      timestamp: new Date().toISOString(),  // Timestamp of the message
    },
  };

  try {
    await dynamoDB.put(params).promise();
    console.log('Message saved to DynamoDB');
  } catch (error) {
    console.error('Error saving message to DynamoDB:', error);
  }
}

// Retrieve messages between two users (or in a public chat room)
async function getMessages(senderId, receiverId) {
  const params = {
    TableName: TABLE_NAME,
    KeyConditionExpression: 'senderId = :senderId AND receiverId = :receiverId',
    ExpressionAttributeValues: {
      ':senderId': senderId,
      ':receiverId': receiverId
    }
  };

  try {
    const data = await dynamoDB.query(params).promise();
    return data.Items;
  } catch (error) {
    console.error('Error retrieving messages from DynamoDB:', error);
    return [];
  }
}

module.exports = { saveMessage, getMessages };
