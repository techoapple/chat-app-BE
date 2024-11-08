const AWS = require('aws-sdk');
const neptune = new AWS.NeptuneData();

// Get user relationships from Neptune (e.g., friends)
async function getUserFriends(userId) {
  const params = {
    query: `MATCH (u:User)-[:FRIENDS_WITH]->(f:User) WHERE u.id = '${userId}' RETURN f`
  };

  try {
    const result = await neptune.query(params).promise();
    return result;
  } catch (error) {
    console.error('Error fetching user friends:', error);
  }
}

module.exports = { getUserFriends };
