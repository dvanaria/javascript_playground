// All color information is eventually filtered down to the graphics
// context's fillStyle() function, for example:
//
//    ctx.fillStyle = playground_color_name[12];
//
// ctx.fillStyle expects a string parsed as a CSS <color> value, which
// can be pre-defined strings such as "blue" or hexadecimal values such
// as "#FF22AA"


// Game Setup
print_to_textgrid(2, 2, "Use left and right arrow keys to move.");
print_to_textgrid(32, 29, "This will be a line printed in the textgrid.");
print_to_textgrid(12, 8, "Use spacebar to jump (and play sound).", 32);
print_to_textgrid(17, 13, "This will be a line printed in the textgrid.", 48);
print_to_textgrid(0, 24, "Press M to test memory-mapped graphics...");
set_text_background_color(5,15,55);
set_text_background_color(15,18,75);
set_text_background_color(25,25,105);

var imageData = new ImageData(playgroundWidth, playgroundHeight);

function fill_memory_mapped_graphics() {

  for (var i = 0; i < imageData.data.length; i++) {

      if((i+1)%4 != 0) {
         imageData.data[i] = Math.round(255 * Math.random());
      }
      else {
         imageData.data[i] = 255;  // alpha is always = 255
      }
  }
}



fill_memory_mapped_graphics();

  


user_input = { 
    left: false, 
    right: false, 
    jump: false 
};

document.addEventListener('keydown',    onkeydown,    false);
document.addEventListener('keyup',      onkeyup,      false);
//canvas.addEventListener('click',      onclick,      false);
//canvas.addEventListener('mousemove',  onmousemove,  false);
//canvas.addEventListener('touchstart', ontouchstart, false);
//canvas.addEventListener('touchmove',  ontouchmove,  false);

function onkeydown(event) {
    console.log('event: onkeydown');
    switch(event.keyCode) {
        case KEYBOARD_KEY.LEFT:
            user_input.left = true;
            break;
        case KEYBOARD_KEY.RIGHT:
            user_input.right = true;
            break;
        case KEYBOARD_KEY.SPACE:
            user_input.jump = true;
            break;
        case KEYBOARD_KEY.M:
            fill_memory_mapped_graphics();
            break;
    }
}

function onkeyup(event) {
    console.log('event: onkeyup');
    switch(event.keyCode) {
        case KEYBOARD_KEY.LEFT:
            user_input.left = false;
            break;
        case KEYBOARD_KEY.RIGHT:
            user_input.right = false;
            break;
        case KEYBOARD_KEY.SPACE:
            user_input.jump = false;
            break;
    }
}
        

var audio = new Howl({
    src: ['audio_file.mp3']
});


player = {
    x: 50,
    y: 50,
    color: 87
};


// Game Loop definition 
let secondsPassed;
let oldTimeStamp;
let fps;
function gameLoop(timeStamp) {

    // Calculate the number of seconds passed since the last frame
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);  // to avoid big gaps
    oldTimeStamp = timeStamp;

    // Calculate fps
    fps = Math.round(1 / secondsPassed);

    // Update game state
    if(user_input.left === true) {
        player.x-=5;
    } 
    if(user_input.right === true) {
        player.x+=5;
    } 
    if(user_input.jump === true) {
        audio.pause();
        player.color = Math.floor(Math.random() * 141);
        audio.play();
    }
    
    // Clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    // Draw new screen
    ctx.putImageData(imageData, 0, 0);   // memory-mapped graphics?
    draw_textgrid();
    ctx.fillStyle = playground_color_name[player.color];
    ctx.fillRect(player.x, player.y, 8, 8);

    // Establish next loop call
    window.requestAnimationFrame(gameLoop);
}





// Run
window.requestAnimationFrame(gameLoop);
