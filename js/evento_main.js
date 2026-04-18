// ----------------------------------------------------------------------------CLASE APORTE
class Evento_Perfil extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_tipo, _padre) {
    super(createDiv(), "perfil perfil_" + _tipo, _padre);

    this.tipo = _tipo;
  }
}

// ----------------------------------------------------------------------------CLASE APORTE
class Evento_Aportes extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_padre) {
    super(createDiv(), "aportes", _padre);

    // Espacio para aportes
    this.aportes = [];
    this.innerDiv = new Hueso(createDiv(), "aportesInner", this);

    // Botón para agregar aportes
    this.agregarDiv = new Hueso(createDiv(), "aportesInner2", this);
    this.agregarButt = new Evento_Agregar("aporte", this.agregarDiv);
    this.element.elt.addEventListener(
      "agregar",
      this.nuevoAporte.bind(this, true),
    );

    // Mover el botón agregar cuando se cambia el texto
    this.element.elt.addEventListener(
      "inputAbierto",
      this.agregarButt.moverACaja.bind(this.agregarButt, this.agregarDiv),
    );
    this.element.elt.addEventListener(
      "inputCerrado",
      this.agregarButt.moverACaja.bind(this.agregarButt, this.agregarDiv),
    );

    // Crea un aporte inicial
    this.nuevoAporte(false);
  }

  // ---------------------------------------------------------------AGREGAR APORTE
  nuevoAporte(_startOpen) {
    let a = new Hueso(createDiv(), "aporte noContainer textBox", this.innerDiv);

    let t = new HuesoTexto("Dato relevante", "aporte_texto", a, _startOpen);

    let iDiv = new Hueso(createDiv(), "icon_container", a);
    let i = new HuesoIcon("test2", "rombo", iDiv, true);

    this.aportes.push(a);

    // Opción de click derecho para borrar
    a.newContextOption(
      "borrar",
      "Borrar aporte",
      this.borrarAporte.bind(this, a),
    );

    // Mueve el botón de agregar para que siga donde corresponde
    this.agregarButt.moverACaja(this.agregarDiv);
  }

  // ---------------------------------------------------------------BORRAR APORTE
  borrarAporte(_a) {
    let i = this.aportes.indexOf(_a);

    this.aportes[i].element.remove();
    this.aportes.splice(i, 1);
  }
}

// ----------------------------------------------------------------------------CLASE TAGS
class Evento_Tags extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_tipo, _padre) {
    super(createDiv(), "tags tags_" + _tipo, _padre);

    this.tipo = _tipo;

    // Div para acumular las tags
    this.tags = [];
    this.innerDiv = new Hueso(createDiv(), "tagsInner", this);

    // Botón para agregar tag
    this.agregarDiv = new Hueso(createDiv(), "tagsInner2", this);
    this.agregarButt = new Evento_Agregar("tag", this.agregarDiv);
    this.element.elt.addEventListener("agregar", this.nuevaTag.bind(this));

    this.nuevaTag();
  }

  // ---------------------------------------------------------------AGREGAR NUEVA TAG
  nuevaTag(_e) {
    // Crea primero un div para que tenga el marquito de noContainer
    let iconDiv = new Hueso(createDiv(), "iconito, noContainer", this.innerDiv);

    // Crea un nuevo ícono y lo abre con el IconMenu ya desplegado
    let nuevoIcon = new HuesoIcon("test", "happy", iconDiv, true);
    if (_e) {
      nuevoIcon.pedirCambio(_e);
    }

    // La deja a mano en un array
    this.tags.push(iconDiv);

    // Opción de click derecho para borrar
    iconDiv.newContextOption(
      "borrar",
      "Borrar etiqueta",
      this.borrarTag.bind(this, iconDiv),
    );

    // Reubicar botón de agregar
    this.agregarButt.moverACaja(this.agregarDiv);
  }

  // ---------------------------------------------------------------BORRAR TAG
  borrarTag(_t) {
    let i = this.tags.indexOf(_t);

    this.tags[i].element.remove();
    this.tags.splice(i, 1);
  }
}

// ----------------------------------------------------------------------------CLASE AGREGAR
class Evento_Agregar extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_tipo, _padre) {
    super(createDiv(""), _tipo + " agregar noContainer", _padre);

    this.tipo = _tipo;

    // Le agrega el dibujito
    this.icon = new Hueso(createDiv("+"), "agregar_plus", this);
    this.actualizarTam();

    // Hace sus cosas al hacerle click
    this.element.mouseClicked(this.clickSensor.bind(this));

    // Avisar que este objeto sólo se muestra al seleccionar el Evento
    this.element.elt.dispatchEvent(
      new CustomEvent("holaSoyOcultable", {
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  // ---------------------------------------------------------------INTERACCIÓN
  clickSensor(_e) {
    // Avisar que se agregue algo, a quien corresponda
    this.element.elt.dispatchEvent(
      // new CustomEvent("agregar_" + this.tipo, {
      new CustomEvent("agregar", {
        detail: {
          tipo: this.tipo,
          original_e: _e,
        },
        bubbles: true,
        cancelable: true,
      }),
    );
  }
}
