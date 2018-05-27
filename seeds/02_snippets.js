
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE snippet RESTART IDENTITY CASCADE;')
    .then(function () {
      // Inserts seed entries
      return knex('snippet').insert([
        {useraccount_id: 1, text: 'This is a test.', tags: {tags: ['test1', 'test2']}}
      ]);
    });
};
