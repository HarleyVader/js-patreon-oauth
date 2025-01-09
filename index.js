const express = require('express');
const session = require('express-session');
const config = require('./config');
const oauthHandler = require('./oauthHandler.js');
const apiClient = require('./apiClient');
const ejs = require('ejs');

const app = express();
const router = express.Router();

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

// Add the router routes here
router.get('/login', (req, res) => {
  oauthHandler.handleLogin(req, res, config);
});

router.get('/callback', (req, res) => {
  oauthHandler.handleCallback(req, res, config);
});

router.get('/oauth2/callback', (req, res) => {
  oauthHandler.handleCallback(req, res, config);
});

router.get('/profile', async (req, res) => {
  const accessToken = req.session.accessToken;
  if (!accessToken) return res.redirect('/login');

  try {
    const userData = await apiClient.getUserData(accessToken);
    const user = userData.data.attributes;
    const memberships = userData.included.filter(item => item.type === 'member');
    const addresses = userData.included.filter(item => item.type === 'address');
    const tiers = userData.included.filter(item => item.type === 'tier');

    res.render('profile', {
      user,
      memberships,
      addresses,
      tiers,
      unescape: ejs.filters.unescape
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.use('/', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});