const database = require('./database-connection')

module.exports = {
  getUserName(email) {
    return database('useraccount')
    .where('useraccount.email', '=', email)
    .select('useraccount.firstName')
  },
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
  getItemById(id){
    return database('item')
    .where('item.id', '=', id)
  },
  getTagsByUser(email){
    return database('useraccount')
    .join('item', 'useraccount.id', 'item.useraccount_id')
    .join('item_tag', 'item.id', 'item_tag.item_id')
    .join('tag', 'item_tag.tag_id', 'tag.id')
    .where('useraccount.email', '=', email)
    .select('tag.text')
  },
  getUserIdByEmail(email){
    return database('useraccount')
    .select('useraccount.id')
    .where('useraccount.email', '=', email)
  },
  getUserEmailByItemId(id){
    return database('item')
    .join('useraccount', 'item.useraccount_id', 'useraccount.id')
    .select('useraccount.email')
    .where('item.id', '=', id)
  },
  checkTag(tag){
    return database('tag')
    .where('tag.text', '=', tag)
  },
  createUser(user) {
    return database('useraccount')
    .insert(user)
    .returning("*")
    .then(record => record[0]);
  },
  createItem(item){
    return database('item')
    .insert(item)
    .returning("*")
    .then(record => record[0]);
  },
  createTag(tag){
    return database('tag')
    .insert({text: tag})
    .returning("*")
    .then(record => record[0]);
  },
  createItemTag(entry){
    return database('item_tag')
    .insert(entry)
    .returning("*")
    .then(record => record[0]);
  },
  updateItem(item){
    return database('item')
    .update(item)
    .returning("*")
    .then(record => record[0]);
  },
  deleteItem(id){
    return database('item')
    .where('item.id', '=', id)
    .del()
  },
  deleteTag(text) {
    return database('tag')
    .where('tag.text', '=', text)
    .del()
  }
}
