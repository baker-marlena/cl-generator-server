
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tag', table => {
    table.increments('id').primary()
    table.text('text')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('tag')
};
