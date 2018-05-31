const okta = require('@okta/okta-sdk-nodejs')
require('dotenv').config()

const client = new okta.Client({
  orgUrl: process.env.DOMAIN,
  token: process.env.API_KEY
})

module.exports = client
