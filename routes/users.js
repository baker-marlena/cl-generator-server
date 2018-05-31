const express = require('express')
const queries = require('../queries')
const oktaClient = require('../oktaClient')

const router = express.Router()

router.post('/register', (req, res, next) => {
  console.log('getting the request', req.body)
  if (!req.body) return res.sendStatus(400)
  oktaClient.createUser(req.body)
    .then(user => {
      queries.createUser(user.profile.login)
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
