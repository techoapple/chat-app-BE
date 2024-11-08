const express = require('express');
const {
  signUp,
  confirmSignUp,
  signIn
} = require('../controllers/authController');

const router = express.Router();

// Route for user sign-up
router.post('/signup', async (req, res) => {
  const { username, password, email } = req.body;
  const result = await signUp(req, res);
  return res.status(result.status).json(result.data);
});

// Route for user confirmation
router.post('/confirm', async (req, res) => {
  const { username, confirmationCode } = req.body;
  const result = await confirmSignUp(req, res);
  return res.status(result.status).json(result.data);
});

// Route for user sign-in
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const result = await signIn(req, res);
  return res.status(result.status).json(result.data);
});

module.exports = router;
