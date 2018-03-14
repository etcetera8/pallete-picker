const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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
    "hex_codes": ["#ac468b", "#fe55d", "#26e425", "#fc133", "#f25d90"],
    "project_key": "1"
  },
  {
    "id": "234",
    "palette_name": "sequence",
    "hex_codes": ["#bc568b", "#ce75d", "#36b425", "#fc133", "#114346"],
    "project_key": "2"
  },
  {
    "id": "2345",
    "palette_name": "greeenies",
    "hex_codes": ["#ce75a", "#ce75d", "#36b425", "#fc133", "#00a"],
    "project_key": "3"
  },
];

app.get('/api/v1/palettes/', (request, response) => {
  const { palettes } = app.locals;

  response.json({ palettes })
})


app.get('/api/v1/palettes/:id/', (request, response) => {
  const { id } = request.params;

  const palette = app.locals.palettes.filter( palette => palette.project_key === id);
  if (palette) {
    console.log(palette);
    
    response.status(200).json(palette)
  } else {
    response.sendStatus(404)
  }
});

app.get('/api/v1/projects', (request, response) => {
  const { projects } = app.locals;

  response.json({ projects })
})

let globalId = 4;

app.post('/api/v1/projects', (request, response) => {
  const id = globalId;
  globalId+=1;
  console.log(globalId);
  
  const { project_name } = request.body;
  const project = { id, project_name }
  app.locals.projects.push(project);
  response.status(201).json(project)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000`); 
})