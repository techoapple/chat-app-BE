const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Save chat messages to DynamoDB
async function saveMessageToDynamoDB(message, senderId, receiverId) {
  const params = {
    TableName: 'ChatMessages',
    Item: {
      messageId: new Date().getTime().toString(),
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
    },
  };

  try {
    await dynamoDB.put(params).promise();
    console.log('Message saved to DynamoDB');
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

module.exports = { saveMessageToDynamoDB };
