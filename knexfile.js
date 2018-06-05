// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres:///coverletter'
  },

  production: {
    client: 'postrgesql',
    connection: process.env.DATABASE_URL
  }

};
