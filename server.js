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
    "project_name": "Project 2", 
    "palettes": true
  }
];

app.locals.palettes = [
  { 
    "id": "1234",
    "palette_name": "not fun stuff",
    "hex_codes": ["#000", "#111", "#fff", "#555", "#321"],
    "project_key": "1"
  }
];

app.get('/api/v1/palettes', (request, response) => {
  const { palettes } = app.locals;

  response.json({palettes})
})

app.get('/api/v1/projects', (request, response) => {
  const { projects } = app.locals;

  response.json({projects})
})

app.post('/api/v1/projects', (request, response) => {
  const id = Date.now();
  const { project_name, palettes } = request.body;
  const project = { id, project_name, palettes }
  app.locals.projects.push(project);
  response.status(201).json(project)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000`); 
})