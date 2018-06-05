
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE useraccount RESTART IDENTITY CASCADE;')
    .then(function () {
      // Inserts seed entries
      return knex('useraccount').insert([
        {email: 'baker.marlena@gmail.com', firstName: 'Marlena'}
      ]);
    });
};
