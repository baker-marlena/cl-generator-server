const database = require('./database-connection')

module.exports = {
  getListByUser(email, type) {
    return database('useraccount')
    .join(type, 'useraccount.id', `${type}.useraccount_id`)
    .where('useraccount.email', '=', email)
    .select(`${type}.text`, `${type}.id`, `${type}.tags`)
  }
}
