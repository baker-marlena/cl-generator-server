
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
        {text: "teaching"},
        {text: "project management"},
        {text: "project lifecyle"},
        {text: "remote"},
        {text: "call to action"},
        {text: "learner"},
        {text: "challenges"},
        {text: "development"},
        {text: "efficency"},
        {text: "opinions"},
        {text: "feedback"},
        {text: "self-improvement"},
        {text: "pearson"},
        {text: "technical"},
        {text: "startup"},
        {text: "collaboration"},
        {text: "teamwork"},
        {text: "agile"},
        {text: "creativity"},
        {text: "design"},
        {text: "problem solving"},
        {text: "communication"},
        {text: "documentation"},
        {text: "little bird"},
        {text: "community"},
        {text: "vue"},
        {text: "node"},
        {text: "javascript"},
        {text: "pwa"}
      ]);
    });
};
