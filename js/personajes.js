// ----------------------------------------------------------------------------CLASE PERSONAJE
class Personaje {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    this.nombre;
    this.participaciones = [];
  }
}

// ----------------------------------------------------------------------------CREAR EVENTO NUEVO
let personajes = [];

function crearPersonaje(){
  personajes.push(new Personaje())
}
