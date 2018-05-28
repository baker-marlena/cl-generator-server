
exports.up = function(knex, Promise) {
  return knex.schema.createTable('item', table => {
    table.increments('id')
    table.integer('useraccount_id').unsigned()
    table.foreign('useraccount_id').references('useraccount.id').onDelete('CASCADE')
    table.text('text')
    table.text('type')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('item')
};
