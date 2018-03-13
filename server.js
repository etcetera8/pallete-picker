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
    "palettes": [
      { "palette_name": "fun n' stuff",
        "hex_codes": ["#000, #111, #fff, #555, #321"]
      }
    ]
  }
]

app.get('/api/v1/projects', (request, response) => {
  const { projects } = app.locals;

  response.json(projects)
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} server running on port 3000`); 
})