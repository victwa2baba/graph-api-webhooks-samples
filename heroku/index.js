var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var app = express();

const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'));

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Welcome to the Instagram Login API!');
});

// Redirect to Instagram for authentication  
app.get('/auth/instagram', function(req, res) {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authUrl);
});

// Handle redirect from Instagram  
app.get('/auth/instagram/callback', function(req, res) {
  const code = req.query.code;
  
  if (code) {
    const options = {
      url: 'https://api.instagram.com/oauth/access_token',
      method: 'POST',
      form: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code  
      }
    };

    request(options, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        const data = JSON.parse(body);
        // Handle successful login here  
        res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
      } else {
        res.sendStatus(400);
      }
    });
  } else {
    res.sendStatus(400);
  }
});

app.listen();
