// ----------------------------------------------------------------------------CONTENEDOR DEL CANVAS
class HuesoCanvas extends Hueso{
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super("#canvas");

    // Información para controlar el dragscroll
    this.dragscrollData = { top: 0, left: 0, x: 0, y: 0 };
    this.dragscrollStarted = false;
    this.dragscrolling = false;
    this.dragscrolled = false;

    // Eventos del mouse para el dragscroll
    this.element.mousePressed(this.mouseDownHandler.bind(this));
    this.element.mouseMoved(this.mouseMoveHandler.bind(this));
    this.element.mouseReleased(this.mouseUpHandler.bind(this));

    // Opciones para el menú contextual
    this.contextOptions.push(
      new ContextOption(this, "crearEvento", "Nuevo evento"),
    );
  }

  // ---------------------------------------------------------------MOUSE PULSADO
  mouseDownHandler(_e) {
    // Sólo reacciona al click derecho
    if (_e.button === 2) {
      this.dragscrollStarted = true;
      this.element.elt.dispatchEvent(
        new CustomEvent("dragscrollStart", {
          bubbles: true, // Allows the event to bubble up the DOM
          cancelable: true, // Allows the event's default action to be prevented
        }),
      );

      this.dragscrollData = {
        // The current scroll
        left: this.element.elt.scrollLeft,
        top: this.element.elt.scrollTop,
        // Get the current mouse position
        x: _e.clientX,
        y: _e.clientY,
      };
    }
  }
  // ---------------------------------------------------------------MOUSE EN MOVIMIENTO
  mouseMoveHandler(_e) {
    // Sólo se ejecuta si el mouse se presionó sobre el área
    if (this.dragscrollStarted) {
      this.dragscrolling = true;
      this.dragscrolled = true;

      // Change the cursor and prevent user from selecting the text
      this.element.elt.style.cursor = "grabbing";
      this.element.elt.style.userSelect = "none";

      // How far the mouse has been moved
      const dx = _e.clientX - this.dragscrollData.x;
      const dy = _e.clientY - this.dragscrollData.y;

      // Scroll the element
      this.element.elt.scrollTop = this.dragscrollData.top - dy;
      this.element.elt.scrollLeft = this.dragscrollData.left - dx;
    }
  }
  // ---------------------------------------------------------------MOUSE SOLTADO
  mouseUpHandler() {
    if (this.dragscrollStarted) {
      // Reconocer si recién terminó de dragscrollear
      if (!this.dragscrolling) {
        this.dragscrolled = false;
        this.element.elt.dispatchEvent(
          new CustomEvent("dragscrollEnd", {
            bubbles: true, // Allows the event to bubble up the DOM
            cancelable: true, // Allows the event's default action to be prevented
          }),
        );
      }
      this.dragscrolling = false;
      this.dragscrollStarted = false;

      // Estilo del cursor
      this.element.elt.style.cursor = "default";
      this.element.elt.style.removeProperty("user-select");
    }
  }
}

// const canvasDiv = document.querySelector("#canvas");

// let dragscrollData = { top: 0, left: 0, x: 0, y: 0 };
// let dragscrolling = false;
// let dragscrolled = false;

// // ---------------------------------------------------------------MOUSE PULSADO
// canvasDiv.addEventListener("mousedown", (e) => {
//   // Sólo reacciona al click derecho
//   if (e.button === 2) {
//     dragscrollData = {
//       // The current scroll
//       left: canvasDiv.scrollLeft,
//       top: canvasDiv.scrollTop,
//       // Get the current mouse position
//       x: e.clientX,
//       y: e.clientY,
//     };

//     document.addEventListener("mousemove", mouseMoveHandler);
//     document.addEventListener("mouseup", mouseUpHandler);
//   }
// });

// // ----------------------------------------------------------------------------MOUSE EN MOVIMIENTO
// const mouseMoveHandler = function (e) {
//   dragscrolling = true;
//   dragscrolled = true;

//   // Change the cursor and prevent user from selecting the text
//   canvasDiv.style.cursor = "grabbing";
//   canvasDiv.style.userSelect = "none";

//   // How far the mouse has been moved
//   const dx = e.clientX - dragscrollData.x;
//   const dy = e.clientY - dragscrollData.y;

//   // Scroll the element
//   canvasDiv.scrollTop = dragscrollData.top - dy;
//   canvasDiv.scrollLeft = dragscrollData.left - dx;

//   // Esconder menú contextual
//   contextMenu.ocultar();
// };

// // ----------------------------------------------------------------------------MOUSE SOLTADO
// const mouseUpHandler = function () {
//   // Reconocer si recién terminó de dragscrollear
//   if (!dragscrolling) {
//     dragscrolled = false;
//   }
//   dragscrolling = false;

//   document.removeEventListener("mousemove", mouseMoveHandler);
//   document.removeEventListener("mouseup", mouseUpHandler);

//   canvasDiv.style.cursor = "default";
//   canvasDiv.style.removeProperty("user-select");
// };
