// EL CANVAS EN SÍ TIENE QUE SER DEL TAMAÑO DE LA PANTALLA Y TENER ALGO MÁS GRANDE ADENTRO PARA SER SCROLLEABLE
// ANTES ERA EL P5.CANVAS PERO LO ELIMINASTE JAJA QUÉ PRINGAO

// ----------------------------------------------------------------------------CONTENEDOR DEL CANVAS
class HuesoCanvas extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(document.getElementById("canvas"));
    // this.element.style.width = window.innerWidth * 2 + "px";
    // this.element.style.height = window.innerHeight * 2 + "px";

    this.canvas = new Hueso(document.getElementById("innerCanvas"));

    // Dibujar líneas de referencia
    let vw2 = window.innerWidth * 2;
    let vh2 = window.innerHeight * 2;
    this.canvas.element.innerHTML =
      "<svg style='position:absolute' width=" +
      vw2 +
      " height=" +
      vh2 +
      " > <line x1=0 y1=0 x2=" +
      vw2 +
      " y2=" +
      vh2 +
      ' stroke="black" stroke-width="1" /> <line x1=0 y1=' +
      vh2 +
      " x2=" +
      vw2 +
      ' y2=0 stroke="black" stroke-width="1" /> </svg>';

    // Información para controlar el dragscroll
    this.dragscrollData = { top: 0, left: 0, x: 0, y: 0 };
    this.dragscrollStarted = false;
    this.dragscrolling = false;
    this.dragscrolled = false;

    // Eventos del mouse para el dragscroll
    this.element.addEventListener(
      "mousedown",
      this.mouseDownHandler.bind(this),
    );
    document.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
    document.addEventListener("mouseup", this.mouseUpHandler.bind(this));

    // Tramas
    this.tramas = [];
    this.tramas.push(new HuesoTrama(this.canvas));

    // Crear y borrar Evento
    this.newContextOption(
      "crearEvento",
      "Nuevo evento",
      this.crearEvento.bind(this),
    );
  }

  // ---------------------------------------------------------------LÓGICA DE DRAGSCROLL
  mouseDownHandler(_e) {
    // Sólo reacciona al click derecho
    if (_e.button === 2) {
      this.dragscrollStarted = true;
      this.element.dispatchEvent(
        new CustomEvent("dragscrollStart", {
          bubbles: true, // Allows the event to bubble up the DOM
          cancelable: true, // Allows the event's default action to be prevented
        }),
      );

      this.dragscrollData = {
        // The current scroll
        left: this.element.scrollLeft,
        top: this.element.scrollTop,
        // Get the current mouse position
        x: _e.clientX,
        y: _e.clientY,
      };
    }
  }
  mouseMoveHandler(_e) {
    // Sólo se ejecuta si el mouse se presionó sobre el área
    if (this.dragscrollStarted) {
      this.dragscrolling = true;
      this.dragscrolled = true;

      // Change the cursor and prevent user from selecting the text
      this.element.style.cursor = "all-scroll";
      this.element.style.userSelect = "none";

      // How far the mouse has been moved
      const dx = _e.clientX - this.dragscrollData.x;
      const dy = _e.clientY - this.dragscrollData.y;

      // Scroll the element
      this.element.scrollTop = this.dragscrollData.top - dy;
      this.element.scrollLeft = this.dragscrollData.left - dx;
    }
  }
  mouseUpHandler() {
    if (this.dragscrollStarted) {
      // Reconocer si recién terminó de dragscrollear
      if (!this.dragscrolling) {
        this.dragscrolled = false;
        this.element.dispatchEvent(
          new CustomEvent("dragscrollEnd", {
            bubbles: true, // Allows the event to bubble up the DOM
            cancelable: true, // Allows the event's default action to be prevented
          }),
        );
      }
      this.dragscrolling = false;
      this.dragscrollStarted = false;

      // Estilo del cursor
      this.element.style.cursor = "default";
      this.element.style.removeProperty("user-select");
    }
  }

  // ---------------------------------------------------------------CREAR EVENTO
  crearEvento(_e) {
    let e = _e.detail.original_e;

    for (let t of this.tramas) {
      //   if (t.contieneTarget(e)) {
      t.nuevoEvento(e);
      //   }
    }
  }
}

// ----------------------------------------------------------------------------CREAR OBJETO CANVAS
let huesoCanvas;
document.addEventListener("DOMContentLoaded", () => {
  huesoCanvas = new HuesoCanvas();
});
