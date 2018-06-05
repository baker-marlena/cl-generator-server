const express = require('express')
const queries = require('../queries')
const oktaClient = require('../oktaClient')
const OktaJwtVerifier = require('@okta/jwt-verifier');

const router = express.Router()

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

router.get('/', checkAuthToken, (req, res, next) => {
  const userEmail = req.jwt.claims.sub
  queries.getUserName(userEmail)
  .then(user => {
    console.log(user);
    res.send({data: user[0]})
  })
})

router.post('/register', (req, res, next) => {
  console.log('getting the request', req.body)
  if (!req.body) return res.sendStatus(400)
  oktaClient.createUser(req.body)
    .then(user => {
      queries.createUser({email: user.profile.login, name: user.profile.firstName})
      .then(response => {
        res.status(201)
        res.send(user)
      })
    })
    .catch(err => {
      res.status(400)
      res.send(err)
    })
})

module.exports = router
