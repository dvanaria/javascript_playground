// Version 1.1

// Note:
//
//    ctx.fillStyle is "A string parsed as CSS <color> value."
//
//    The input.js file defines a dictionary that maps strings like "ESC" 
//    and "SPACE" to numeric values such as 27 and 32.
//  
//        KEYBOARD_KEY["ESC"]  ->  returns 27
//        KEYBOARD_KEY.ESC     ->  returns 27
//

// Global Parameters
let playgroundWidth = 320;
let playgroundHeight = 240;
let playgroundScale = 1; // used to scale canvas on higher resolution screens
let playgroundTranslateX = 0;  // where to position canvas, within browser viewport
let playgroundTranslateY = 0;
let browserVirtualWidth = 0; // browser's viewport resolution
let browserVirtualHeight = 0;

function calculate_resolutions() {

    // Find local system's resolution (entire screen), ex: 1360 x 768 
    let systemVirtualWidth = Math.round(window.screen.width);
    let systemVirtualHeight = Math.round(window.screen.height);
    console.log(
      "System resolution (virtual): " +
        systemVirtualWidth +
        " x " +
        systemVirtualHeight
    );
    console.log("System resolution (scaling factor): " + window.devicePixelRatio);
    let systemPhysicalWidth = systemVirtualWidth * window.devicePixelRatio;
    let systemPhysicalHeight = systemVirtualHeight * window.devicePixelRatio;
    console.log(
      "System resolution (physical): " +
        systemPhysicalWidth +
        " x " +
        systemPhysicalHeight
    );

    // Find browser's resolution (it's viewport), ex: 1360 x 625
    browserVirtualWidth = Math.round(window.innerWidth);
    browserVirtualHeight = Math.round(window.innerHeight);
    console.log(
      "Browser viewport (virtual): " +
        browserVirtualWidth +
        " x " +
        browserVirtualHeight
    );
    let browserPhysicalWidth = browserVirtualWidth * window.devicePixelRatio;
    let browserPhysicalHeight = browserVirtualHeight * window.devicePixelRatio;
    console.log(
      "Browser viewport (physical): " +
        browserPhysicalWidth +
        " x " +
        browserPhysicalHeight
    );
}

function set_playground_scale() {

    // Calcuate Correct Scaling to fill up higher (system) resolutions
    let test_factor_x = 1;
    while (test_factor_x * playgroundWidth < browserVirtualWidth) {
      test_factor_x += 1;
    }
    if (test_factor_x != 1) { 
      test_factor_x -= 1;  // loop incremented one too many
    }

    let test_factor_y = 1;
    while (test_factor_y * playgroundHeight < browserVirtualHeight) {
      test_factor_y += 1;
    }
    if (test_factor_y != 1) { 
      test_factor_y -= 1;  // loop incremented one too many
    }

    // pick the smaller scaling value (x,y)
    if (test_factor_x > test_factor_y) {
      playgroundScale = test_factor_y;
    } else {
      playgroundScale = test_factor_x;
    }
    console.log("Scaling set to " + playgroundScale);
    console.log(
      "Scaled playground size: " +
        playgroundWidth * playgroundScale +
        " x " +
        playgroundHeight * playgroundScale
    );
}

function set_playground_translation() {

    // Calculate Correct Translation so drawing area fits within viewport
    let test_diff_x = browserVirtualWidth - playgroundWidth * playgroundScale;
    playgroundTranslateX = Math.round(test_diff_x / 2);
    let test_diff_y = browserVirtualHeight - playgroundHeight * playgroundScale;
    playgroundTranslateY = Math.round(test_diff_y / 2);
    console.log(
      "Playground area to be moved by: " +
        playgroundTranslateX +
        " x " +
        playgroundTranslateY
    );

}

// Playground setup
calculate_resolutions();
set_playground_scale();
set_playground_translation();





// Dynamically create HTML elements  /////////////////////////////////////////////////////
let outer_container = document.createElement("div");
outer_container.style.position = "relative";
outer_container.style.width = `${playgroundWidth}px`;
outer_container.style.height = `${playgroundHeight}px`;
outer_container.style.margin = "0 auto"; // auto will center along x
outer_container.style.outline = "1px solid #fff";
//outer_container.style.transform = `scale(${playgroundScale}) translateY(${playgroundTranslateY}px)`;
outer_container.style.transform = `scale(${playgroundScale})`;

let canvas = document.createElement("canvas");
canvas.width = playgroundWidth;
canvas.height = playgroundHeight;
canvas.style.imageRendering = "pixelated";
canvas.style.fontWeight = "lighter";

outer_container.appendChild(canvas);
var body = document.getElementsByTagName("body")[0];
body.appendChild(outer_container);
let ctx = canvas.getContext("2d");
// Dynamically create HTML elements  (end) ////////////////////////////////////////////////




// Critical function used in bresenham.js (remember to set ctx.fillStyle to
// some value first, like ctx.fillStyle = "#FF0000";)
function setPixel(x, y) {
  ctx.fillRect(x, y, 1, 1);
}

// Generic graphics functions
function draw_pixel(x, y, color) {
     ctx.fillStyle = color; 
     setPixel(x,y);
}

function draw_line(x1, y1, x2, y2, color) {
     ctx.fillStyle = color; 
     plotLine(x1, y1, x2, y2);
}

function draw_rectangle(x, y, w, h, color) {
     ctx.fillStyle = color; 
     ctx.fillRect(x, y, w, h);
}

function draw_circle(x, y, r, color) {
     ctx.fillStyle = color; 
     plotCircle(x, y, r);
}

function get_random_color_name() {
  let num_colors = playground_color_name.length;
  let choice = Math.floor(Math.random() * num_colors);
  return playground_color_name[choice];
}

function get_random_color_hex_value() {
  let num_colors = playground_color_hex_value.length;
  let choice = Math.floor(Math.random() * num_colors);
  return playground_color_hex_value[choice];
}





// Textgrid system: an 8x8 font within a 320 x 240 pixel screen, 40 x 30 characters
const font_size_w = 8;
const font_size_h = 8;
const textgrid_w = Math.floor(playgroundWidth / font_size_w);
const textgrid_h = Math.floor(playgroundHeight / font_size_h);
const textgrid = new Array();
const fontsheet = new Image();
fontsheet.src = "c64_fontsheet.png";
const textgrid_background = new Array();

function initialize_textgrid() {
  for(let row = 0; row < textgrid_h; row++) {  // create 2d array
    textgrid[row] = new Array(textgrid_w);
    textgrid_background[row] = new Array(textgrid_w);
  }
  for(let row = 0; row < textgrid_h; row++) {
    for(let col = 0; col < textgrid_w; col++) {
      textgrid[row][col] = ' ';
      textgrid_background[row][col] = -1;
    }
  }
  console.log('textgrid created: ' + textgrid_w + ' x ' + textgrid_h);
}

initialize_textgrid();



function print_to_textgrid(x, y, m, color = -1) {
  let row = y;
  let col = x;
  let i = 0;
  while(i < m.length && row < textgrid_h) {
      if(col < textgrid_w) {
          if(row < textgrid_h) {
            textgrid[row][col] = m.charCodeAt(i);
            if(color !== -1) {
              textgrid_background[row][col] = color;
            }
            i++;
            col++;
            if(col >= textgrid_w) {
              col = 0;
              row++;
            }
          }
      }
  }
}

function set_text_background_color(x, y, color) {
  textgrid_background[y][x] = color;
}

function draw_textgrid() {

  let target_row = 0;
  let target_col = 0;

  for(let row = 0; row < textgrid_h; row++) {
    for(let col = 0; col < textgrid_w; col++) {

      if(textgrid_background[row][col] !== -1) {
        ctx.fillStyle = playground_color_name[textgrid_background[row][col]];
        ctx.fillRect(8*col, 8*row, 8, 8);
      }

      target_row = textgrid[row][col] / 16;
      target_row = Math.floor(target_row);
      target_col = textgrid[row][col] - (target_row * 16);

      ctx.drawImage(fontsheet, 
          target_col * 8, target_row * 8, 
          8,8,
          8*col, 8*row,
          8,8); 
    }
  }

}


// TEST SECTION ///////////////////////////////////////////////////

function array_testing() {
  let text = "abcABC`1234567890-=~!@#$%^&*()_+[]\{}|;':";
  text += '"';  // add " symbol
  text += ",./<>?xyzXYZ";
  const myArray = text.split('');          // string METHOD split -> array 
  for(var i = 0; i < myArray.length; i++){  // string PROPERTY length
    console.log(myArray[i] + "    " + myArray[i].charCodeAt(0));
  }
  console.log("character codes in numeric order:");
  for(var i = 0; i < 128; i++) {
    console.log(i + "    " + String.fromCharCode(i));
  }
  console.log('Where to find glyph "a" in the fontsheet:');
  let a = '*';
  a = a.charCodeAt(0);
  let row = Math.floor(a / 16);
  let col = a - (row * 16);
  console.log("row x col: " + row + " x " + col);
}

function random_draw_lines() {
  let x1, y1, x2, y2;
  for (let i = 0; i < 50; i++) {
    x1 = Math.floor(Math.random() * 320);
    y1 = Math.floor(Math.random() * 240);
    x2 = Math.floor(Math.random() * 320);
    y2 = Math.floor(Math.random() * 240);
    if (x1 < 105) {
      ctx.fillStyle = "#FF0000";
    } else if (x1 < 210) {
      ctx.fillStyle = "#00FF00";
    } else {
      ctx.fillStyle = "#0000FF";
    }
    plotLine(x1, y1, x2, y2);
  }
}

function random_fill_textgrid() {
  for(let row = 0; row < textgrid_h; row++) {
    for(let col = 0; col < textgrid_w; col++) {
      textgrid[row][col] = Math.floor(Math.random() * 128);
    }
  }
}

function random_draw_lines_2() {
    for(let i = 0; i < 1000; i++) { 
      let x1 = Math.floor(Math.random() * 320);
      let y1 = Math.floor(Math.random() * 240);
      let x2 = Math.floor(Math.random() * 320);
      let y2 = Math.floor(Math.random() * 240);
      let c = get_random_color_name();
      c = get_random_color_hex_value();
      let r = Math.floor(Math.random() * 100);
      let w = Math.floor(Math.random() * 100);
      let h = Math.floor(Math.random() * 100);

      switch(Math.floor(Math.random() * 4)) {
          case 0:
              draw_pixel(x1, y1, c);
              break;
          case 1:
              draw_line(x1, y1, x2, y2, c); 
              break;
          case 2:
              draw_rectangle(x1, y1, w, h, c);
              break;
          case 3:
              draw_circle(x1, y1, r, c);
              break;
      }

    }
  }


// TEST SECTION ///////////////////////////////////////////////////