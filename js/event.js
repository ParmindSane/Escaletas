// ----------------------------------------------------------------------------CLASE EVENTO
class Evento extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_x, _y, _clase, _padre) {
    super(_x, _y, _clase, _padre);

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

    this.newContextoOption(
      "eventoEvento",
      "Evento ah",
      this.eventoEvento.bind(this),
    );
    this.newContextoOption(
      "otroEventoEvento",
      "Evento UwU",
      this.nuevoParticipante.bind(this),
    );

    // Objetos internos por defecto
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
  }

  // ---------------------------------------------------------------PRUEBA DE MENÚ CONTEXTUAL
  eventoEvento(_e) {
    console.log("Evento evento en " + this.posX);
  }

  // ---------------------------------------------------------------CREAR UN NODO DE PERSONAJE
  nuevoParticipante() {
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
