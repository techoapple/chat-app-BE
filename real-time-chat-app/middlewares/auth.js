const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Middleware to check JWT token from AWS Cognito
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://cognito-idp.<your-region>.amazonaws.com/<your-cognito-pool-id>/.well-known/jwks.json`
  }),
  audience: '<your-cognito-client-id>',
  issuer: `https://cognito-idp.<your-region>.amazonaws.com/<your-cognito-pool-id>`,
  algorithms: ['RS256']
});

module.exports = checkJwt;
