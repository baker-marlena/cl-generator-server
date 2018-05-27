const database = require('./database-connection')

module.exports = {
  getListByUser(email) {
    return database('useraccount')
    .join('item', 'useraccount.id', `item.useraccount_id`)
    .where('useraccount.email', '=', email)
    .select('item.id', 'item.text', 'item.type')
  },
  getItemTags(id) {
    return database('item_tag')
    .join('tag', 'item_tag.tag_id', 'tag.id')
    .where('item_tag.item_id', '=', id)
    .select('tag.text')
  },
  getTagsByUser(email){
    return database('useraccount')
    .join('item', 'useraccount.id', 'item.useraccount_id')
    .join('item_tag', 'item.id', 'item_tag.item_id')
    .join('tag', 'item_tag.tag_id', 'tag.id')
    .where('useraccount.email', '=', email)
    .select('tag.text')
  }
}
