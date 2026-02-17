// ----------------------------------------------------------------------------DECLARACIÓN
let DEBUG = false;
let debugCode = "";

let huesoCanvas;
let contextMenu;

// ----------------------------------------------------------------------------SETUP
function setup() {
  huesoCanvas = new HuesoCanvas();
  let canvasDiv = document.querySelector("#canvas");

  let theCanvas = createCanvas(windowWidth * 2, windowHeight * 2);
  theCanvas.parent(canvasDiv);

  colorMode(HSB, 360, 100, 100, 100);
  rectMode(CENTER);

  contextMenu = new ContextMenu();

  actualizar();
}

// ----------------------------------------------------------------------------"DRAW"
function actualizar() {
  background(220);

  line(0, 0, width, height);
  line(0, height, width, 0);
}

// ----------------------------------------------------------------------------EVENTOS DE TECLADO
// Tipear "123" sin soltar ninguna tecla activa/desactiva el modo Debug
function keyPressed() {
  debugCode += key;

  if (debugCode === "123") {
    DEBUG = !DEBUG;
    console.log("---Modo Debug " + (DEBUG ? "ON" : "OFF") + "---");
  }
}
function keyReleased() {
  debugCode = [];
}
