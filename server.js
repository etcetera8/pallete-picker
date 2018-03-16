const express = require('express'); //Bringing in express from node modules
const app = express(); //Making an instance of express to use its methods
const bodyParser = require('body-parser'); //Bringing in parser to turn body into json from computer language

const environment = process.env.NODE_ENV || 'development'; //Definining the environment the app will be listening from
const configuration = require('./knexfile')[environment]; // Bringing in knex configs and telling it which environment to use
const database = require('knex')(configuration); //Bringing in knex and pointing to database to write sql queries in JS, currying our configurations into it

app.set('port', process.env.PORT || 3000); //Sets the port to either what is given or defaults 3000
app.use(bodyParser.json()); //Adding bodyParser on app to read body json
app.use(express.static('public')); //Using public folder to server static files to '/'
app.locals.title = 'Palette Picker'; // Title of app

app.get('/api/v1/projects', (request, response) => { //making route to projects endpoint
  database('projects').select() //Points to projects table in db and selects all
  .then( (projects) => { //callback to return array on success 
    response.status(200).json(projects) //adds status to response and projects array to json
  })
  .catch(error => { // error handling for errors requesting data
    response.status(500).json({ error });
  })
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body; //Grabs the body from the sent request and stores it in variable

  for (let requiredParameter of ['project_name']) { //sets project name as a required parameter sent in the body
    if(!project[requiredParameter]) { //if the body doesn't have the key set the respons status to a 422 and send an error
      return response.status(422).send({
        error: `Expected format: {project_name: <String>}. You're missing a "${requiredParameter}" property.`
      });
    }
  }

  database('projects').insert(project, 'id') //Inserts the body and sets a new id into the projects table of the db
    .then(project => { 
      response.status(201).json({ id: project[0] }) //on success sets status and responds with the id of new project
    })
    .catch( error => { //sets error if something goes wrong setting it or db error
      response.status(500).json({ error })
    })
})

app.post('/api/v1/palettes/', (request, response) => { //makes palettes endpoint for posting to it
  const palette = request.body; //saves the sent request body i.e. the palette as a variable

  for (let requiredParameter of ['palette_name']) { //sets the palette_name as a required paramater sent with the body 
    if (!palette[requiredParameter]) {// if the body doesn't have the key set the response status to 422 and send an error report back
      return response.status(422).send({
        error: `Expected format: {palette_name: <String>}. You're missing a "${requiredParameter}" property.`
      });
    }
  }

  database('palettes').insert(palette, 'id') //inserts a new palette and a new id into the palettes table in the db
    .then(palette => {
      response.status(201).json({ id: palette[0] }) //if successful sets status and sets json to id of newly added palette
    })
    .catch(error => { //sets response error if db fails for some reason
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/palettes/:id', (request, response) => { //sets delete endpoint
  database('palettes').where('id', request.params.id).del() //Finds id matching the request param in the database table palette and deletes it with knex delete func
  .then(palette => {   
    if ( palette ) {  //if that palette with that id exists respond with a succesful deletion and jsons the palette
      response.status(202).json(palette); 
    } else {
      response.status(404).json({ error: "No record to delete"}) //if it can't find that palette with that id respons with not found, and set error to no record to delete
    }
  })
  .catch(error => { //sets error if something goes wrong with db
    response.status(500).json({ error })
  })

})

app.get('/api/v1/palettes/', (request, response) => { //sets get route for all palettes endpoint
  database('palettes').select() //gets all palettes from palettes table in the database
  .then( palettes => {
    response.status(200).json(palettes); //sets response status if succesful json // sets json to all found palettes
  })
  .catch(error => { //sets error if something wrong with db
    response.status(500).json({ error });
  })
})


app.get('/api/v1/projects/:id/palettes', (request, response) => { //sets route for get response to specific project palette
  database('palettes').where('project_id', request.params.id).select() //gets palettes that foriegn key match with the request params sent in the url from the palettes table in the db
    .then( palettes => {
      if(palettes.length) { //if the palettes exist with that foreign key the .then return will have length
        response.status(200).json(palettes); //if so set the status to success and json the results
      } else { 
        response.status(404).json({ // else set that palettes with that foreign id couldnt be found
          error: `Could not find project with id ${request.params.id}` //set error
        })
      }
    }).catch(error => { //sets error if something wrong with db
      response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => { //uses express listen method to listen and setup connection to backend and frontend
  console.log(`${app.locals.title} server running on port 3000`); 
})

module.exports = app; //exports the app for use in testing