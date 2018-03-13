const generate = $('#generate');
//$(`#${color.id}`).find('button');


const lock = window.onload = () => {
  generatePalette();
}

const generatePalette = () => {
  const palleteArray = document.querySelectorAll('.unlocked');
  palleteArray.forEach(color => {
    const hexCode = generateHex();
    $(`#${color.id}`).css("background-color", `${hexCode}`)
    $(`#${color.id} span:first-child`).text(hexCode);
  });
}

window.onkeydown = function (e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
    generatePalette();
  }
};  

generate.click(() => generatePalette());

const generateHex = () => {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).toUpperCase();
}

const lockColor = () => {
  console.log('locked'); 
}

$(window).click((e) => {
  console.log(e.target);
  
})

