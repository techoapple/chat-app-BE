const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

// Initialize Cognito Identity Provider
const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'your-region'  // Replace with your AWS region
});

// Your Cognito User Pool settings
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;

// Sign Up a New User
async function signUp(req, res) {
  const { username, password, email } = req.body;

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email
      }
    ]
  };

  try {
    const signUpResponse = await cognito.signUp(params).promise();
    return res.status(200).json({ message: 'Sign up successful!', signUpResponse });
  } catch (error) {
    console.error('Error during sign-up:', error);
    return res.status(400).json({ error: error.message });
  }
}

// Confirm User Signup (after the user receives a confirmation code)
async function confirmSignUp(req, res) {
  const { username, confirmationCode } = req.body;

  const params = {
    ClientId: CLIENT_ID,
    Username: username,
    ConfirmationCode: confirmationCode
  };

  try {
    const confirmResponse = await cognito.confirmSignUp(params).promise();
    return res.status(200).json({ message: 'User confirmed successfully!', confirmResponse });
  } catch (error) {
    console.error('Error during confirmation:', error);
    return res.status(400).json({ error: error.message });
  }
}

// User Sign-In (Login)
async function signIn(req, res) {
  const { username, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: CLIENT_ID,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  };

  try {
    const authResult = await cognito.initiateAuth(params).promise();
    return res.status(200).json({
      message: 'Sign-in successful!',
      idToken: authResult.AuthenticationResult.IdToken,
      accessToken: authResult.AuthenticationResult.AccessToken,
      refreshToken: authResult.AuthenticationResult.RefreshToken
    });
  } catch (error) {
    console.error('Error during sign-in:', error);
    return res.status(400).json({ error: error.message });
  }
}

// Verify JWT Token (Middleware or utility function)
function verifyToken(token) {
  try {
    const decodedToken = jwt.verify(token, 'your-jwt-secret');  // Replace 'your-jwt-secret' with your secret or use a public key
    return decodedToken;
  } catch (error) {
    console.error('Invalid token:', error);
    throw new Error('Invalid token');
  }
}

module.exports = { signUp, confirmSignUp, signIn, verifyToken };
