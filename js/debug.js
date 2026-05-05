// ----------------------------------------------------------------------------CREAR OBJETO DEBUG
let DEBUG = false;

let debugCursor;
document.addEventListener("DOMContentLoaded", () => {
  debugCursor = new HuesoDebug();
});

// ----------------------------------------------------------------------------CLASE DEBUG
class HuesoDebug extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(document.getElementById("debugCursor"));

    // ---------------------------------------------------------------ACTIVAR/DESACTIVAR MODO DEBUG
    let debugCode = "";

    document.addEventListener("keydown", function (_e) {
      debugCode += _e.key;

      // Se activa al pulsar "123" sin soltar ninguna tecla
      if (debugCode === "123") {
        DEBUG = !DEBUG;
        console.log("---Modo Debug " + (DEBUG ? "ON" : "OFF") + "---");
      }
    });

    document.addEventListener("keyup", function (_e) {
      debugCode = "";
    });

    // ---------------------------------------------------------------MOSTRAR MACHETE
    document.addEventListener("mousemove", function (_e) {
      if (DEBUG) {
        // Mover machete al cursor
        debugCursor.element.classList.remove("oculto");
        debugCursor.mover(_e.pageX + 20, _e.pageY);

        // El machete muestra las coords "globales" (canvas) y locales (hovering) del cursor
        let canvasRect = document.getElementById("canvas");
        let globalCoords =
          "G: " +
          Math.floor(_e.clientX + canvasRect.scrollLeft) +
          " , " +
          Math.floor(_e.clientY + canvasRect.scrollTop);
        let localCoords =
          "L: " + Math.floor(_e.offsetX) + " , " + Math.floor(_e.offsetY);
        debugCursor.element.textContent = globalCoords + "\n" + localCoords;
      } else {
        debugCursor.element.classList.add("oculto");
      }
    });
  }
}
