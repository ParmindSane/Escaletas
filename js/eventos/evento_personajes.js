// ----------------------------------------------------------------------------CLASE CONECTOR
class Evento_Conector extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_padre) {
    super(document.createElement("div"), "conectaNodos", _padre);
    this.getTam();
    this.desfasar(-this.tamX / 2, 0);

    // Crear el botón de agregar personaje
    // this.agregarDiv = new HuesoFlotante(document.createElement("div"), "conectaNodosButt", this);
    this.agregar = new Evento_Agregar("participante", this);
    this.agregar.mover(
      -this.agregar.getTam().x / 4,
      this.agregar.getTam().y,
    );

    // Avisar que este objeto sólo se muestra al seleccionar el Evento
    this.element.dispatchEvent(
      new CustomEvent("holaSoyOcultable", {
        bubbles: true,
        cancelable: true,
      }),
    );
  }
}

// ----------------------------------------------------------------------------CLASE PARTICIPANTE
class Evento_Personaje extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_i, _padre) {
    super(document.createElement("div"), "eventoPersonaje eventoNodo participante_" + _i, _padre);

    // Tags
    this.tagsDiv = new Evento_Tags("personaje", this);

    // Perfil
    this.perfilDiv = new Hueso(document.createElement("div"), "perfil noContainer", this);

    // Objetivo
    this.deseoDiv = new HuesoTexto(
      "Objetivo",
      "resumen textBox noContainer",
      this,
    );

    // Aportes
    this.aportesDiv = new Evento_Aportes(this);

    // centrar
    this.centrar(); // <----centrar (centrar)

    // Pendorchito que lo conecta al nodo anterior
    this.conector = new HuesoFlotante(document.createElement("div"), "conectaNodos", this);
    this.conector.getTam();
    this.conector.desfasar(-this.conector.tamX / 2, -this.conector.tamY);
  }
  nuevoTexto(_tipo, _cartel, _padre) {
    let contenedor = new Hueso(
      createDiv(_tipo),
      "objetivo noContainer" + _tipo,
      _padre,
    );
    let texto = new HuesoTexto(
      _cartel,
      "objetivo textBox",
      this.mainDiv,
      false,
    );
  }

  // ---------------------------------------------------------------CENTRAR
  centrar() {
    this.desfasar(
      -(
        this.tagsDiv.getTam().x +
        this.perfilDiv.getTam().x +
        this.deseoDiv.getTam().x / 2
      ),
      false,
    );
  }
}
