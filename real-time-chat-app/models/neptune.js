const AWS = require('aws-sdk');

// Initialize AWS SDK for Neptune
const neptune = new AWS.Neptune({
  region: 'your-region',  // Replace with your AWS region
  endpoint: process.env.NEPTUNE_ENDPOINT  // Define Neptune endpoint in your .env file
});

// Example function to query user relationships from Neptune (Gremlin query)
async function getUserFriends(userId) {
  const params = {
    // Example of a Neptune Gremlin query
    query: `g.V().hasLabel('User').has('id', '${userId}').out('FRIENDS_WITH').values('friendId')`
  };

  try {
    const result = await neptune.query(params).promise();
    console.log('Friends retrieved:', result);
    return result;
  } catch (error) {
    console.error('Error querying Neptune:', error);
    throw error;
  }
}

// Add a friend connection between two users
async function addFriend(userId, friendId) {
  const params = {
    query: `g.V().hasLabel('User').has('id', '${userId}')
                 .addE('FRIENDS_WITH').to(g.V().hasLabel('User').has('id', '${friendId}'))`
  };

  try {
    const result = await neptune.query(params).promise();
    console.log('Friend connection added:', result);
    return result;
  } catch (error) {
    console.error('Error adding friend in Neptune:', error);
    throw error;
  }
}

module.exports = { getUserFriends, addFriend };
