// ----------------------------------------------------------------------------CLASE EVENTO
class Evento extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_x, _y, _clase, _padre) {
    super(_x, _y, _clase, _padre);

    // Cosas para hacer el Evento draggeable
    this.dragClick = false;
    this.dragging = false;
    this.dragData = { px: 0, py: 0, mx: 0, my: 0 };
    this.element.mousePressed(this.mouseDown.bind(this));
    document.addEventListener("mousemove", this.mouseMoved.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));

    // Datos de la escaleta
    this.title;
    this.resumen;
    this.index;
    this.tiempo;
    this.lugar;
    this.tension;
    this.trama;
    this.tags = [];
    this.personajes = [];
    this.aportes = []; //ARREGLO DE DOS DIMENSIONES: [PERSONAJE][DATO] (el personajes.length sería el general)

    this.vistaDetallada = true;

    // ---------------------------------------------------------------NODO PRINCIPAL
    // Objetos iniciales
    this.mainDiv = new HuesoFlotante(0, 0, "eventoMain", this);
    this.lugarDiv = new Hueso("perfil", this.mainDiv);
    this.resumenDiv = new Hueso("resumen", this.mainDiv);

    // Acomodar posición en función del nuevo tamaño por contenido
    this.leftOffset = this.lugarDiv.tamX + this.resumenDiv.tamX / 2;
    this.actualizarPosTam(-this.leftOffset, 0, 0, 0);

    // Objetos flotantes
    this.titleDiv = new HuesoFlotante(0, 0, "title", this.mainDiv);
    this.titleDiv.actualizarPosTam(
      this.leftOffset - this.resumenDiv.tamX / 2,
      -this.titleDiv.tamY,
      0,
      0,
    );

    // Puntos para conectar con las otras escenas de la trama
    this.preTramaLink;
    this.posTramaLink;

    // Opciones de menú contextual
    this.newContextOption(
      "eventoEvento",
      "Evento ah",
      this.contextTest1.bind(this),
    );
    for (let i = 0; i < 1; i++) {
      this.newContextOption(
        "EventoEvento_" + i,
        "a " + i,
        this.contextTest2.bind(this),
      );
    }
  }

  // ---------------------------------------------------------------EVENTOS PARA DRAGGEAR
  mouseDown(_e) {
    // Sólo con el click izquierdo
    if (_e.button === 0) {
      this.dragClick = true;

      // Guardar datos iniciales del mouse
      this.dragData.px = mouseX;
      this.dragData.py = mouseY;
      this.dragData.mx = 0;
      this.dragData.my = 0;
    }
  }
  mouseMoved(_e) {
    // Cuando ya empezó a draggear
    if (this.dragClick || this.dragging) {
      this.dragging = true;
      this.dragClick = false;

      this.element.style("cursor", "all-scroll");

      // Calcular desplazamiento del mouse
      this.dragData.mx = mouseX - this.dragData.px;
      this.dragData.my = mouseY - this.dragData.py;
      this.dragData.px = mouseX;
      this.dragData.py = mouseY;

      // Actualizar posición
      this.mover(this.dragData.mx, this.dragData.my);
    }
  }
  mouseUp(_e) {
    if (this.dragging) {
      this.element.style("cursor", "default");
    }

    this.dragging = false;
    this.dragClick = false;
  }

  // ---------------------------------------------------------------PRUEBA DE MENÚ CONTEXTUAL
  contextTest1(_e) {
    console.log("Evento evento en " + this.posX);
  }

  // ---------------------------------------------------------------CREAR UN NODO DE PERSONAJE
  contextTest2() {
    console.log("OTRO evento evento en " + this.posX);
  }
}

// ----------------------------------------------------------------------------CREAR EVENTO NUEVO
let eventos = [];

document.addEventListener("crearEvento", function (e) {
  eventos.push(new Evento(round(mouseX), round(mouseY), "evento", huesoCanvas));
});

// // ----------------------------------------------------------------------------CLASE PERSONAJE EN EVENTO
// class Participante extends Hueso {
//   // ---------------------------------------------------------------CONSTRUCTOR
//   constructor(_p, _e) {
//     this.personaje = _p;
//     this.evento = _e;
//     this.objetivo = [];
//     this.tags = [];
//     this.aportes = [];
//   }
// }
