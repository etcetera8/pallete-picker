const generate = $('#generate');

const lock = window.onload = () => {
  generatePalette();
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

