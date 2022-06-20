// Global Parameters
let playgroundWidth = 320;
let playgroundHeight = 240;
let playgroundScale = 1; // factor used to fill screen on larger resolution
let playgroundTranslateX = 0;
let playgroundTranslateY = 0;

// Find local system's resolution (entire screen), ex: 1360 x 768 [actual physical pixels]
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

// Find browser's resolution (in it's viewport), ex: 1360 x 625
let browserVirtualWidth = Math.round(window.innerWidth);
let browserVirtualHeight = Math.round(window.innerHeight);
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

// Calcuate Correct Scaling to fill up larger (system) resolutions

let test_factor_x = 1;
while (test_factor_x * playgroundWidth < browserPhysicalWidth) {
  test_factor_x += 1;
}
test_factor_x -= 1;
if (test_factor_x < 1) {
  test_factor_x = 1;
}

let test_factor_y = 1;
while (test_factor_y * playgroundHeight < browserPhysicalHeight) {
  test_factor_y += 1;
}
test_factor_y -= 1;
if (test_factor_y < 1) {
  test_factor_y = 1;
}

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

// Calculate Correct Translation so drawing area fits on screen
let test_diff_x = browserPhysicalWidth - playgroundWidth * playgroundScale;
playgroundTranslateX = Math.round(test_diff_x / 2);
let test_diff_y = browserPhysicalHeight - playgroundHeight * playgroundScale;
playgroundTranslateY = Math.round(test_diff_y / 2);
console.log(
  "Playground area moved by: " +
    playgroundTranslateX +
    " x " +
    playgroundTranslateY
);

// Dynamically create HTML elements
let outer_container = document.createElement("div");
outer_container.style.position = "relative";
outer_container.style.width = `${playgroundWidth}px`;
outer_container.style.height = `${playgroundHeight}px`;
outer_container.style.margin = "0 auto";
outer_container.style.outline = "1px solid #fff";
outer_container.style.transform = `scale(${playgroundScale}) translateY(${playgroundTranslateY}px)`;

let canvas = document.createElement("canvas");
canvas.width = playgroundWidth;
canvas.height = playgroundHeight;
canvas.style.imageRendering = "pixelated";
canvas.font-smoothing = "never";
canvas.webkit-font-smoothing = "none";

outer_container.appendChild(canvas);
var body = document.getElementsByTagName("body")[0];
body.appendChild(outer_container);
let ctx = canvas.getContext("2d");

// Critical function used in bresenham.js (remember to set ctx.fillStyle = "#FF0000";)
function setPixel(x, y) {
  ctx.fillRect(x, y, 1, 1);
}

// Sprite
let sprite_1 = new Image();
sprite_1.src = "cat.bmp";
sprite_1.onload = () => {
  ctx.drawImage(sprite_1, 5, 5);
};
