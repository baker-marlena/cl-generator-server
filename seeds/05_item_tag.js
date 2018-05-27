
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex.raw('TRUNCATE item_tag RESTART IDENTITY CASCADE;')
    .then(function () {
      // Inserts seed entries
      return knex('item_tag').insert([
        {item_id:1 , tag_id:1 },
        {item_id:1 , tag_id:2 },
        {item_id:2 , tag_id:3 },
        {item_id:2 , tag_id:4 },
        {item_id:2 , tag_id:2 },
        {item_id:3 , tag_id:3 },
        {item_id:3 , tag_id:5 },
        {item_id:4 , tag_id:6 },
        {item_id:4 , tag_id:7 },
        {item_id:4 , tag_id:3 }
      ]);
    });
};
