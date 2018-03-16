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
$(document).on('click', '.lock-btn', (event) => lockToggle(event))
$('select').ready( () => loadOptions())
$('#saved-projects').on('click', '.palette-title', (event) => displayProjectThumbnails(event));
$(document).on('click', '.delete-palette', (event) => deletePalette(event))
window.onkeydown = function (e) {
  if ( e.keyCode === 32 && e.target === document.body ) {
    e.preventDefault();
    generatePalette();
  }
};

const generateHex = () => {
  return '#' + Math.random().toString(16).slice(-6).toUpperCase();
}

const lockToggle = (event) => {
  $(event.target).toggleClass('lock unlock')
}

const loadOptions = async () => {
  $('select').empty();
  const projectNames = await fetch('/api/v1/projects')
  const data = await projectNames.json();

  data.forEach(project => {
    dropDown.append($(`<option>${project.project_name}</option>`).val(`${project.id}`))
  })
}

const displayProjectThumbnails = (event) => {
  const thumbnails = Array.from($(event.target).closest('div').children('#thumbnails').children());
  const hexCodes = thumbnails.map(thumb => thumb.title)
  $('.color').toArray().forEach((el, index) => {
    $(el).css('background-color', hexCodes[index]);
    $(el).children('.hex-code').text(hexCodes[index]);
  })
}

const deletePalette = async (event) => {
  const paletteId = event.target.value

  await fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  })
    .then(response => response.json())
    .then(json => {
      return json;
    });
  $(`.${paletteId}`).remove();
}

const addNewProject = async (e) => {
  e.preventDefault();
  const projectName = $('#project-name').val();
  const projectNames = document.querySelectorAll('.project-title');
  const duplicateName = Array.from(projectNames).find(title => title.innerText.toUpperCase() === projectName.toUpperCase())
  
  if (projectName.length < 1 || duplicateName ) {
    $('.error').toggle();
  } else {
    $('.error').hide();
    fetch('/api/v1/projects', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"project_name": projectName})
    })
    .then( response => {
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
    createProjectThumbnail();
    loadOptions();
  }
}

const addNewPalette = (e) => {
  e.preventDefault();
  const input = $('#palette-name').val();
  
  if ( input.length < 1 ) {
    //do nothing
  } else {
    const paletteName = $('#palette-name').val();
    const projectId = $('select').val();    
    const hexCodes = Array.from(document.querySelectorAll('.hex-code')).map(code => {
      return code.innerHTML
    })
    
    fetch('/api/v1/palettes', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "project_id": projectId,
        "colors": [...hexCodes],
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

const getPalettes = async (projects) => {
  const ids = await projects.map(async (project) => {
    const response = await fetch(`/api/v1/projects/${project.id}/palettes`);
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
  
  projects.forEach( project => {
    const template = 
      `<article id=${project.id} class="saved-project thumbnails">
          <h3 class="project-title">${project.project_name}</h3>
        </article>`
      $('#saved-projects').append(template)
  })

  const palettes = await getPalettes(projects);
  createPaletteThumbnails(palettes);
}

const createPaletteThumbnails = async (palettes) => {
  $('#thumbnails').empty();
  palettes.forEach( project => {
    project.forEach( palette => {
      const { palette_name, id } = palette;
      
      const template = 
        `<div class=${palette.id}>
          <section class='title-align'>
            <span class="palette-title">${palette_name}</span>
            </section>
            <button value=${palette.id} class="delete-palette"></button>
          <div id="thumbnails">
            <div class="thumbnail-color" title=${palette.colors[0]} style="background-color:${palette.colors[0]};"></div>
            <div class="thumbnail-color" title=${palette.colors[1]} style="background-color:${palette.colors[1]};"></div>
            <div class="thumbnail-color" title=${palette.colors[2]} style="background-color:${palette.colors[2]};"></div>
            <div class="thumbnail-color" title=${palette.colors[3]} style="background-color:${palette.colors[3]};"></div>
            <div class="thumbnail-color" title=${palette.colors[4]} style="background-color:${palette.colors[4]};"></div>
          </div>
        </div>`
      $(`#${palette.project_id}`).append(template);
    })
  })
}




