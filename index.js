const express = require('express');
const session = require('express-session');
const config = require('./config');
const oauthHandler = require('./oauthHandler');
const apiClient = require('./apiClient');

const app = express();

// Middleware for session management
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Route for login
app.get('/login', (req, res) => {
  oauthHandler.handleLogin(req, res, config);
});

// Route for OAuth callback
app.get('/callback', (req, res) => {
  oauthHandler.handleCallback(req, res, config);
});

// Route for profile
app.get('/profile', async (req, res) => {
  const accessToken = req.session.accessToken;
  if (!accessToken) return res.redirect('/login');

  try {
    const userData = await apiClient.getUserData(accessToken);
    const { attributes: { email, full_name } } = userData.data;

    res.render('profile', {
      user: {
        name: full_name,
        email,
      },
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});