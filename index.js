// index.js
const express = require('express');
const config = require('./config');
const oauthHandler = require('./oauthHandler');
const apiClient = require('./apiClient');

const app = express();

app.get('/login', oauthHandler.handleLogin);

app.get('/callback', (req, res) => {
  oauthHandler.handleCallback(req, res, config);
});

// Create a /profile route to store the access token and retrieve user data
app.get('/profile', async (req, res) => {
  const accessToken = req.session.accessToken;
  if (!accessToken) return res.redirect('/login');

  const userData = await apiClient.getUserData(accessToken);
  const { attributes: { email, full_name } } = userData.data;

  // Store the access token in the session
  req.session.accessToken = accessToken;

  res.render('profile', {
    user: {
      name: full_name,
      email,
    },
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
