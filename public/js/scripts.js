const generate = $('#generate');

const generatePalette = () => {
  const palleteArray = document.querySelectorAll('.unlocked');
  palleteArray.forEach(color => {
    $(`#${color.id}`).css("background-color", `${generateHex()}`)
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
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

