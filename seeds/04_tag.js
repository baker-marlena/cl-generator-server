
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE tag RESTART IDENTITY CASCADE;')
    .then(function () {
      // Inserts seed entries
      return knex('tag').insert([
        {text: "tools"},
        {text: "intro"},
        {text: "education"},
        {text: "passion"},
        {text: "students"},
        {text: "galvanize"},
        {text: "teaching"}
      ]);
    });
};
