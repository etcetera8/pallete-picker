exports.seed = function (knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('palettes').del() // delete all palettes first
    .then(() => knex('projects').del()) // delete all projects

    // Now that we have a clean slate, we can re-insert our projects data
    .then(() => {
      return Promise.all([

        // Insert a single project, return the project ID, insert 1 palette
        knex('projects').insert({ project_name: 'Project 1' }, 'id')
          .then(project => {
            return knex('palettes').insert([
              {
                palette_name: 'a nice palette',
                project_id: project[0],
                colors: ["#000", "#fff", "#00a", "#00b", "#00c"],
                color1: "#000",
                color2: "#fff",
                color3: "#00a",
                color4: "#00b",
                color5: "#00c",
              },
              {
                palette_name: 'the worlds greatest palette',
                project_id: project[0],
                colors: ["#000", "#fff", "#00a", "#00b", "#00c"],
                color1: "#000",
                color2: "#fff",
                color3: "#00a",
                color4: "#00b",
                color5: "#00c",
              }
            ])
          })
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};