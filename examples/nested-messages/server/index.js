require('dotenv').config();
const path = require('path');
const fetch = require('cross-fetch');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.json());

// Fetch token from developer portal and return to the embedded app
app.post('/api/token', async (req, res) => {
  const response = await fetch(`https://discord.com/api/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: req.body.code,
    }),
  });

  const {access_token} = await response.json();

  res.send({access_token});
  return;
});

app.listen(3000);
