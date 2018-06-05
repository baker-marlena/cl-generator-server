
exports.up = function(knex, Promise) {
  return knex.schema.table('useraccount', table => {
    table.text('firstName')
  })
};

exports.down = function(knex, Promise) {

};
