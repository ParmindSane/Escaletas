// ----------------------------------------------------------------------------CLASE DATABASE
class ControlDePerfiles {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    this.lugares = [];

    this.personajes = [];

    document.addEventListener("crearPerfil_lugar", this.crearLugar.bind(this));
  }

  crearLugar(_e) {
    
  }
}

// ----------------------------------------------------------------------------CLASE PERSONAJE
class Perfil {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    this.nombre;
    this.img;

    this.participaciones = [];
  }
}

// ----------------------------------------------------------------------------CLASE LUGAR
class Lugar extends Perfil {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {}
}

// ----------------------------------------------------------------------------CLASE PERSONAJE
class Personaje extends Perfil {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {}
}
