const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OktaJwtVerifier = require('@okta/jwt-verifier');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-593134.oktapreview.com/oauth2/default',
  assertClaims: {
    aud: 'api://default'
  }
});

app.get('/list', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);
  if (!match) {
    res.status(401);
    res.send('Unauthorized');
  }
  const accessToken = match[1];
  return oktaJwtVerifier.verifyAccessToken(accessToken)
    .then((jwt) => {
      console.log(jwt.claims.sub);
      res.json(jwt)
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
});

app.listen(process.env.PORT || 3000);
