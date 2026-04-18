// ----------------------------------------------------------------------------CONTENEDOR DEL CANVAS
class HuesoCanvas extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(select("#canvas"));

    // Información para controlar el dragscroll
    this.dragscrollData = { top: 0, left: 0, x: 0, y: 0 };
    this.dragscrollStarted = false;
    this.dragscrolling = false;
    this.dragscrolled = false;

    // Eventos del mouse para el dragscroll
    this.element.mousePressed(this.mouseDownHandler.bind(this));
    document.addEventListener("mousemove", this.mouseMoveHandler.bind(this));
    document.addEventListener("mouseup", this.mouseUpHandler.bind(this));

    // Tramas
    this.tramas = [];
    this.tramas.push(new HuesoTrama(this));

    // Crear y borrar Evento
    this.newContextOption(
      "crearEvento",
      "Nuevo evento",
      this.crearEvento.bind(this),
    );
    // this.element.elt.addEventListener(
    //   "borrarEvento",
    //   this.borrarEvento.bind(this),
    // );
  }

  // ---------------------------------------------------------------LÓGICA DE DRAGSCROLL
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
  mouseMoveHandler(_e) {
    // Sólo se ejecuta si el mouse se presionó sobre el área
    if (this.dragscrollStarted) {
      this.dragscrolling = true;
      this.dragscrolled = true;

      // Change the cursor and prevent user from selecting the text
      this.element.elt.style.cursor = "all-scroll";
      this.element.elt.style.userSelect = "none";

      // How far the mouse has been moved
      const dx = _e.clientX - this.dragscrollData.x;
      const dy = _e.clientY - this.dragscrollData.y;

      // Scroll the element
      this.element.elt.scrollTop = this.dragscrollData.top - dy;
      this.element.elt.scrollLeft = this.dragscrollData.left - dx;
    }
  }
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

  // ---------------------------------------------------------------CREAR EVENTO
  crearEvento(_e) {
    let e = _e.detail.original_e;

    for (let t of this.tramas) {
      //   if (t.contieneTarget(e)) {
      t.nuevoEvento(e);
      //   }
    }
  }

  // // ----------------------------------------------------------------------------BORRAR EVENTO SELECCIONADO
  // borrarEvento(_e) {
  //   let h = _e.target.hueso;

  //   // Eliminar eventos globales asociados
  //   document.removeEventListener("mousemove", h.mouseMoved.bind(h));
  //   document.removeEventListener("mouseup", h.mouseUp.bind(h));

  //   // Eliminar el Hueso del array
  //   for (let t of this.tramas) {
  //     if (t.contieneTarget(_e)) {
  //       let i = t.eventos.indexOf(h);
  //       t.eventos.splice(i, 1);
  //     }
  //   }

  //   // Borrar el HTML
  //   h.element.remove();

  //   // El objeto sólo se borra si ya no tiene referencias en ejecución,
  //   // así que recemos para que esto sea suficiente (?
  // }
}

// // ----------------------------------------------------------------------------CREAR EVENTO NUEVO
// let eventos = [];
// document.addEventListener("crearEvento", function (_e) {
//   // eventos.push(new HuesoEvento(round(mouseX), round(mouseY), huesoCanvas));
//   let e = _e.detail.original_e;
//   eventos.push(new HuesoEvento(round(e.offsetX), round(e.offsetY), huesoCanvas));
// });

// // ----------------------------------------------------------------------------BORRAR EVENTO SELECCIONADO
// document.addEventListener("borrarEvento", function (_e) {
//   let h = _e.target.hueso;

//   // Eliminar eventos globales asociados
//   document.removeEventListener("mousemove", h.mouseMoved.bind(h));
//   document.removeEventListener("mouseup", h.mouseUp.bind(h));

//   // Eliminar el Hueso del array
//   let i = eventos.indexOf(h);
//   eventos.splice(i, 1);

//   // Borrar el HTML
//   h.element.remove();

//   // El objeto sólo se borra si ya no tiene referencias en ejecución,
//   // así que recemos para que esto sea suficiente (?
// });
