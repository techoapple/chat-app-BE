const AWS = require('aws-sdk');

// Configure AWS SDK
AWS.config.update({
  region: 'your-region',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = AWS;
