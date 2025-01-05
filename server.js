const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8888;

// Endpoint to initiate OAuth2 flow
app.get('/login', (req, res) => {
    const scope = 'email identity';
    const redirectUri = encodeURIComponent(process.env.PATREON_REDIRECT_URI);
    const authUrl = `https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.PATREON_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`;
    res.redirect(authUrl);
});


// Endpoint to handle the redirect from Patreon
app.get('/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('Authorization code not provided');
    }

    try {
        // Exchange authorization code for access token
        const tokenResponse = await axios.post(
            'https://www.patreon.com/api/oauth2/token',
            {
                grant_type: 'authorization_code',
                client_id: process.env.PATREON_CLIENT_ID,
                client_secret: process.env.PATREON_CLIENT_SECRET,
                code,
                redirect_uri: process.env.PATREON_REDIRECT_URI
            }
        );

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;

        // Use the access token to get user information from /identity endpoint
        const userInfoResponse = await axios.get(
            'https://www.patreon.com/api/oauth2/v2/identity',
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                params: {
                    fields: {
                        user: 'about,created,email,first_name,full_name,image_url,last_name,social_connections,thumb_url,url,vanity'
                    }
                }
            }
        );

        const userData = userInfoResponse.data;
        res.send(`User Data: ${JSON.stringify(userData, null, 2)}`);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error);
        res.status(500).send('Failed to authenticate with Patreon');
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
