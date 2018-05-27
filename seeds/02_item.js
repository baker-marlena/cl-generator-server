
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE item RESTART IDENTITY CASCADE;')
    .then(function () {
      // Inserts seed entries
      return knex('item').insert([
        {useraccount_id: 1, type: 'snippet', text: "The people, structure, and tools needed to"},
        {useraccount_id: 1, type: 'snippet', text: "I have a passion for using technology to support education."},
        {useraccount_id: 1, type: 'snippet', text: "At Galvanize, I went through a very similar transformation as a student. I’m familiar with what students go through as they build a new skill set and approach a new career, and I have used that experience to drive my approach to helping others through the process."},
        {useraccount_id: 1, type: 'snippet', text: "I was a teacher at Galvanize, giving me experience explaining technical concepts, writing curriculum, and developing tools for a very similar program."}
      ]);
    });
};
