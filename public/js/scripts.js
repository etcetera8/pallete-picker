const generate = $('#generate');
const newPalette = $('.new-palette-btn');
const newProject = $('.new-project-btn');
const dropDown = $('select');

window.onload = async () => {
  generatePalette();
  
  await createProjectThumbnail();
}

generate.click(() => generatePalette());
newPalette.click((e) => addNewPalette(e))
newProject.click((e)=> addNewProject(e))

$('select').ready( async () => {
  const projectNames = await fetch('/api/v1/projects')
  const data = await projectNames.json();
  
  data.forEach(project => {
    dropDown.append($(`<option>${project.project_name}</option>`).val(`${project.id}`))
  })
})

$(document).on('click', '.lock-btn', (event) => {
  $(event.target).toggleClass('lock unlock')
})

$(document).on('click', '.delete-palette', (event) => {
  const paletteId = event.target.closest("div").id;
  const projectId = event.target.id;
  
  fetch(`/api/v1/palettes/${projectId}`, {
    method: 'DELETE',
    body: {"palette_id": paletteId},
    headers: {
      "palette_id": paletteId
    }
  })
  .then(response => response.json())
  
  $(`#${paletteId}`).remove();
})

const addNewProject = async (e) => {
  e.preventDefault();
  const projectName = $('#project-name').val();
  if (projectName.length < 1 ) {
    console.log('do nothing');
  } else {
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
      $('#saved-projects').fadeOut(800, () => {
        $('#saved-projects').fadeIn().delay(1000)
      })
    })
    .catch( error => {
      console.log('request failed', error);
    })
    $('#project-name').val('');
  }
  createProjectThumbnail();
}

const addNewPalette = (e) => {

  e.preventDefault();
  const project = $('select').val();
  const input = $('#palette-name').val();
  
  if ( input.length < 1 ) {
    console.log('do nothing');
  } else {
    const paletteName = $('#palette-name').val();
    const hexCodes = Array.from(document.querySelectorAll('.hex-code')).map(code => {
      return code.innerHTML
    })
    const newPalette = { name: paletteName, hex_codes: [...hexCodes] }
    console.log(project, newPalette);
    
    fetch('/api/v1/palettes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "id": Date.now(),
        "project_key": project,
        "hex_codes": [...hexCodes],
        "palette_name": paletteName
      })
    })
    .then( response => {
      return response.json();
    })
    .then( results => {
      console.log("these are the results", results);
    })
    .catch( error => {
      console.log('request failed', error);
    })
    
    $('#palette-name').val('');

    createProjectThumbnail();
  }
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

const getPalettes = async (projects) => {
  const ids = await projects.map(async (project) => {
    
    const response = await fetch(`/api/v1/projects/${project.id}/palettes`)
    const palette = await response.json();
    
    return await palette;
  })
  const palettes = await Promise.all(ids);
  
  return palettes;
}

const createProjectThumbnail = async () => {

  $('#saved-projects').empty();

  const response = await fetch('/api/v1/projects')
  const projects = await response.json();  
  
  projects.forEach(project => {
    const template = 
      `<article id=${project.id} class="saved-project thumbnails">
          <h3>${project.project_name}</h3>
        </article>`
      $('#saved-projects').append(template)
  })

  const palettes = await getPalettes(projects);
  createPaletteThumbnails(palettes);
}

const createPaletteThumbnails = async (palettes) => {
  $('#thumbnails').empty();
  palettes.forEach(project => {
    project.forEach(palette => {
      const { palette_name } = palette;
      const template = 
        `<div id=${palette.id}>
          <section class='title-align'>
            <span class="palette-title">${palette_name}</span>
            </section>
            <button id=${palette.project_key} class="delete-palette"></button>
          <div id="thumbnails">
            <div class="thumbnail-color" style="background-color:${palette.colors[0]};"></div>
            <div class="thumbnail-color" style="background-color:${palette.colors[1]};"></div>
            <div class="thumbnail-color" style="background-color:${palette.colors[2]};"></div>
            <div class="thumbnail-color" style="background-color:${palette.colors[3]};"></div>
            <div class="thumbnail-color" style="background-color:${palette.colors[4]};"></div>
          </div>
        </div>`
      $(`#${palette.project_id}`).append(template)
    })
    })

}




