
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE story RESTART IDENTITY CASCADE;')
    .then(function () {
      // Inserts seed entries
      return knex('story').insert([
        {useraccount_id: 1, text: 'This is a story test.', tags: {tags: ['test1', 'test2']}},
      ]);
    });
};
