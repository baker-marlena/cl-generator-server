
exports.up = function(knex, Promise) {
  return knex.schema.createTable('item_tag', table => {
    table.increments('id').primary()
    table.integer('item_id').unsigned()
    table.foreign('item_id').references('item.id')
    table.integer('tag_id').unsigned()
    table.foreign('tag_id').references('tag.id')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists(item_tag)
};
