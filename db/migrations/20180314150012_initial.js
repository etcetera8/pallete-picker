
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('project_name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('palette_name');
      table.integer('paper_id').unsigned()
      table.foreign('project_id')
        .references('projects.id')
        
    })
  ])
};

exports.down = function(knex, Promise) {
  
};
