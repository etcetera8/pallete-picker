import { read } from 'fs';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.enable('trust proxy');

const environment = process.env.NODE_ENV || 'development';


const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function (req, res, next) {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect('https://' + req.header('host') + req.url);
  } else {
    next();
  }
})

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
  .then( (projects) => {
    response.status(200).json(projects)
  })
  .catch(error => {
    response.status(500).json({ error });
  })
})

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['project_name']) {
    if(!project[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: {project_name: <String>}. You're missing a "${requiredParameter}" property.`
      });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch( error => {
      response.status(500).json({ error })
    })
})

app.post('/api/v1/palettes/', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of ['palette_name']) {
    if (!palette[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: {palette_name: <String>}. You're missing a "${requiredParameter}" property.`
      });
    }
  }

  database('palettes').insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] })
    })
    .catch(error => {
      response.status(500).json({ error })
    })
})

app.delete('/api/v1/palettes/:id', (request, response) => {

  database('palettes').where('id', request.params.id).del()
  .then(palette => {   
    if ( palette ) {
      response.status(202).json(palette);
    } else {
      response.status(404).json({ error: "No record to delete"})
    }
  })
  .catch(error => {
    response.status(500).json({ error })
  })

})

app.get('/api/v1/palettes/', (request, response) => {
  database('palettes').select()
  .then( palettes => {
    response.status(200).json(palettes);
  })
  .catch(error => {
    response.status(500).json({ error });
  })
})


app.get('/api/v1/projects/:id/palettes', (request, response) => {
  database('palettes').where('project_id', request.params.id).select()
    .then(palettes => {
      if(palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({
          error: `Could not find project with id ${request.params.id}`
        })
      }
    }).catch(error => {
      response.status(500).json({ error })
    })
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000`); 
})

module.exports = app;