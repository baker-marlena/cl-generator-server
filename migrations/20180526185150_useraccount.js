
exports.up = function(knex, Promise) {
  return knex.schema.createTable('useraccount', table => {
    table.increments('id').primary()
    table.text('email').unique();
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('useraccount');
};
