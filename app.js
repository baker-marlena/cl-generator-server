const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const OktaJwtVerifier = require('@okta/jwt-verifier');
const queries = require('./queries')

const app = express();

app.use(cors());
app.use(bodyParser.json());

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: 'https://dev-593134.oktapreview.com/oauth2/default',
  assertClaims: {
    aud: 'api://default'
  }
});

function checkAuthToken(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    res.status(401);
    return next('Unauthorized');
  }

  const accessToken = match[1];

  return oktaJwtVerifier.verifyAccessToken(accessToken)
    .then((jwt) => {
      req.jwt = jwt;
      next();
    })
    .catch((err) => {
      res.status(401).send(err.message);
    });
}

app.get('/list/:type', checkAuthToken, (req, res, next) => {
  const userEmail = req.jwt.claims.sub
  console.log(userEmail);
  const type = req.params.type
  queries.getListByUser(userEmail, type)
  .then(list =>{
    res.send({data: list})
  })
});

app.listen(process.env.PORT || 3000);
