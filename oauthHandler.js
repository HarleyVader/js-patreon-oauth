const qs = require('querystring');
const axios = require('axios');

module.exports.handleLogin = (req, res, config) => {
  const loginUrl = `https://www.patreon.com/oauth2/authorize?` +
    `response_type=code&` +
    `client_id=${config.clientId}&` +
    `redirect_uri=${encodeURIComponent(config.redirectUri)}&` +
    `scope=campaigns.members`;
  
  res.writeHead(302, { Location: loginUrl });
  res.end();
};

module.exports.handleCallback = async (req, res, config) => {
  const urlParts = req.url.split('?');
  const query = qs.parse(urlParts[1]);

  try {
    const tokenResponse = await axios.post('https://www.patreon.com/api/oauth2/token', {
      code: query.code,
      grant_type: 'authorization_code',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
    });

    const { access_token, refresh_token } = tokenResponse.data;

    // Store the tokens securely (e.g., in a session or database)
    console.log('Access Token:', access_token);
    console.log('Refresh Token:', refresh_token);

    res.writeHead(302, { Location: '/success' });
    res.end();
  } catch (error) {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
};