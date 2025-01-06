// index.js
const http = require('http');
const config = require('./config');
const oauthHandler = require('./oautHandler');



const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  if (req.url === '/login') {
    oauthHandler.handleLogin(req, res, config);
  } else if (req.url.startsWith('/oauth/callback')) {
    oauthHandler.handleCallback(req, res, config);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
