// config.js
require('dotenv').config();

module.exports = {
    clientId: process.env.PATREON_CLIENT_ID,
    clientSecret: process.env.PATREON_CLIENT_SECRET,
    redirectUri: process.env.PATREON_REDIRECT_URI, // Ensure this matches your registered redirect URI
};
  

