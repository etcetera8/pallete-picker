const generate = $('#generate');

generate.click(() => {
  const palleteArray = document.querySelectorAll('.unlocked');
  palleteArray.forEach(color => {
    $(`#${color.id}`).css("background-color", `${generateHex()}`)    
  })  
})

const generateHex = () => {
  return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
}

