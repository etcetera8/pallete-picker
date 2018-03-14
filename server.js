const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(express.static('public'));
app.locals.title = 'Palette Picker';
app.locals.projects = [
  {
    "id": "1",
    "project_name": "Project 1"
  },
  {
    "id": "2",
    "project_name": "Project 2"
  },
  {
    "id": "3",
    "project_name": "Project 3"
  }
];

app.locals.palettes = [
  { 
    "id": "1234",
    "palette_name": "not fun stuff",
    "hex_codes": ["#000", "#111", "#fff", "#555", "#321"],
    "project_key": "1"
  },
  { 
    "id": "12345",
    "palette_name": "fun stuff",
    "hex_codes": ["#ac468b", "#fe55de", "#26e425", "#fc133e", "#f25d90"],
    "project_key": "1"
  },
  {
    "id": "234",
    "palette_name": "sequence",
    "hex_codes": ["#bc568b", "#ce75de", "#36b425", "#fc133e", "#114346"],
    "project_key": "2"
  },
  {
    "id": "2345",
    "palette_name": "greeenies",
    "hex_codes": ["#ce75ae", "#ce75de", "#36b425", "#fc133e", "#00a"],
    "project_key": "3"
  },
];

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
    .catch(error => {
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

// app.delete('/api/v1/palettes/:id', (request, response) => {
//   const { id } = request.params;
//   const { palette_id } = request.headers
//   const newPalettes = app.locals.palettes.filter( (palette, index) => palette.id != palette_id)
//   app.locals.palettes = newPalettes;
//   response.status(202).json(newPalette);
// })

// app.get('/api/v1/palette/:id/', (request, response) => {
//   const { id } = request.params;
// })

// app.get('/api/v1/palettes/:id/', (request, response) => {
//   const { id } = request.params;
  
//   const palette = app.locals.palettes.filter( palette => palette.project_key === id);
//   if (palette) {
//     response.status(200).json(palette)
//   } else {
//     response.sendStatus(404)
//   }
// });
// app.post('/api/v1/projects', (request, response) => {
//   const id = globalId;
//   globalId += 1;

//   const { project_name } = request.body;
//   const project = { id, project_name }
//   app.locals.projects.push(project);
//   response.status(201).json(project)
// })

// app.post('/api/v1/palettes', (request, response) => {
//   app.locals.palettes.push(request.body);
//   response.status(201).json(request.body);
// })