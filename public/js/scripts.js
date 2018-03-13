const generate = $('#generate');

window.onload = async () => {
  generatePalette();
  const response = await fetch('/api/v1/projects')
  const data = await response.json();  
  console.log(data);
  createProjectThumbnail(data)
}

generate.click(() => generatePalette());

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

$(document).on('click', '.lock-btn', (event) => {
  $(event.target).toggleClass('lock unlock')
})

const generateHex = () => {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).toUpperCase();
}

const createProjectThumbnail = async (projectData) => {
  const templates = projectData.projects.map(project => {
    const template = 
      `<article class="saved-project">
          <h3>${project.project_name}</h3>
            <div id="thumbnails">
              <span>${project.palettes[0].palette_name}</span>
              <div class="thumbnail-color" style="background-color:${project.palettes[0].hex_codes[0]};"></div>
              <div class="thumbnail-color" style="background-color:${project.palettes[0].hex_codes[1]};"></div>
              <div class="thumbnail-color" style="background-color:${project.palettes[0].hex_codes[2]};"></div>
              <div class="thumbnail-color" style="background-color:${project.palettes[0].hex_codes[3]};"></div>
              <div class="thumbnail-color" style="background-color:${project.palettes[0].hex_codes[4]};"></div>
              <button class="delete-pallete">
                <i class="fas fa-trash-alt delete-pallete"></i>
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

