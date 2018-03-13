const generate = $('#generate');
const newPalette = $('.new-palette-btn');
const newProject = $('.new-project-btn');
const dropDown = $('select');

window.onload = async () => {
  generatePalette();
  const response = await fetch('/api/v1/projects')
  const data = await response.json();  
  console.log(data);
  createProjectThumbnail(data)
}

generate.click(() => generatePalette());
newPalette.click((e) => addNewPalette(e))
newProject.click((e)=> addNewProject(e))

$('select').focus( async () => {
  const projectNames = await fetch('/api/v1/projects')
  const data = await projectNames.json();
  console.log(data);
  data.projects.forEach(project => {
    dropDown.append($(`<option>${project.project_name}</option>`).val(`${project.id}`))
  })
})

$(document).on('click', '.lock-btn', (event) => {
  $(event.target).toggleClass('lock unlock')
})

$(document).on('click', '.delete-palette', (event) => {
  console.log(event.target);
  
})

const addNewProject = (e) => {
  e.preventDefault();
  const projectName = $('#project-name').val();
  
  fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"project_name": projectName})
  })
  .then( (response) => {
    return response.json()
  })
  .then(results => {
    console.log(results);
  })
  .catch( error => {
    console.log('request failed', error);
  })

  $('#project-name').val('');
}

const addNewPalette = (e) => {
  e.preventDefault();
  const project = $('select').val();
  const paletteName = $('#palette-name').val();
  const hexCodes = Array.from(document.querySelectorAll('.hex-code')).map(code => {
    return code.innerHTML
  })
  const newPalette = { name: paletteName, hex_codes: [...hexCodes] }
  console.log(project, newPalette);

  $('#palette-name').val('');
}

const generatePalette = () => {
  const palleteArray = document.querySelectorAll('.unlocked');
  palleteArray.forEach(color => {
    const hexCode = generateHex();
    if ($(`#${color.id}`).find('button')[0].className.includes('unlock')) {
      $(`#${color.id}`).css("background-color", `${hexCode}`)
      $(`#${color.id} span:first-child`).text(hexCode);
    }
  });
}

window.onkeydown = function (e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
    generatePalette();
  }
};  

const generateHex = () => {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).toUpperCase();
}

const createProjectThumbnail = async (projectData) => {
  const templates = projectData.projects.map(project => {
    const template = 
      `<article class="saved-project">
          <h3>${project.project_name}</h3>
            <div id="thumbnails">
              <span>fake</span>
              <div class="thumbnail-color" style="background-color:yellow;"></div>
              <div class="thumbnail-color" style="background-color:yellow;"></div>
              <div class="thumbnail-color" style="background-color:yellow;"></div>
              <div class="thumbnail-color" style="background-color:yellow;"></div>
              <div class="thumbnail-color" style="background-color:yellow;"></div>
              <button class="delete-palette">
              </button>
            </div>
        </article>`
        return template
  })
  console.log(templates);
  templates.forEach(template => {
    $('#projects').append(template)

  })
}

