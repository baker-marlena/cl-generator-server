
exports.up = function(knex, Promise) {
  return knex.schema.createTable('story', table => {
    table.increments('id')
    table.integer('useraccount_id').unsigned()
    table.foreign('useraccount_id').references('useraccount')
    table.text('text')
    table.json('tags')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('story')
};
