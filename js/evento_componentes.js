// ----------------------------------------------------------------------------CLASE TERMÓMETRO
class Evento_Tension extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_padre) {
    super(createDiv(), "tension noContainer", _padre);

    // Valores que puede tomar el slider
    this.nivel = 0;
    this.nivelMin = 0;
    this.nivelMax = 2;

    // Crear el slider encima del termómetro
    this.sliding = false;
    this.slider = new HuesoFlotante(
      createSlider(this.nivelMin, this.nivelMax, this.nivel, 1),
      "slider",
      this,
    );
    this.slider.actualizarTam();
    this.slider.desfasar(this.tamX / 2, -this.slider.tamY);

    // Detectar cuando se empieza y termina de usar el slider
    // (para que no se pise con la acción de draggear el Evento)
    this.slider.element.mousePressed(this.slidingSensor.bind(this, true));
    this.slider.element.mouseReleased(this.slidingSensor.bind(this, false));

    // Actualizar el color cuando se mueve el slider
    this.slider.element.input(this.cambiarNivel.bind(this));
    this.cambiarNivel();

    // Avisar que este objeto sólo se muestra al seleccionar el Evento
    this.slider.element.elt.dispatchEvent(
      new CustomEvent("holaSoyOcultable", {
        bubbles: true,
        cancelable: true,
      }),
    );
  }

  // ---------------------------------------------------------------DETECTAR USO DEL SLIDER
  slidingSensor(_b) {
    this.sliding = _b;

    if (this.sliding) {
      // Avisar que se empezó a usar el slider
      this.slider.element.elt.dispatchEvent(
        new CustomEvent("inputAbierto", {
          bubbles: true,
          cancelable: true,
        }),
      );
    } else {
      // Ok ya podés draggear otra vez
      this.slider.element.elt.dispatchEvent(
        new CustomEvent("inputCerrado", {
          bubbles: true,
          cancelable: true,
        }),
      );
    }
  }

  // ---------------------------------------------------------------ACTUALIZAR NIVEL
  cambiarNivel() {
    // Convierte el valor del slider en un color entre verde y rojo
    this.nivel = this.slider.element.value();
    let nivelColor = map(this.nivel, this.nivelMin, this.nivelMax, 100, 0);
    let nuevoColor = "hsl(" + nivelColor + ", 100%, 50%)";
    this.element.style("background-color", nuevoColor);
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
    this.agregarButt = new Evento_Agregar("aporte", this);
    this.element.elt.addEventListener(
      // "agregar_aporte",
      "agregar",
      this.nuevoAporte.bind(this, true),
    );

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
      "borrarAporte",
      "Borrar aporte",
      this.borrarAporte.bind(this, this.aportes.indexOf(a)),
    );
  }

  // ---------------------------------------------------------------BORRAR APORTE
  borrarAporte(_i) {
    this.aportes[_i].element.remove();
    this.aportes.splice(_i, 1);
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
    this.agregarButt = new Evento_Agregar("tag", this);
    this.element.elt.addEventListener("agregar", this.nuevaTag.bind(this));
  }

  // ---------------------------------------------------------------AGREGAR NUEVA TAG
  nuevaTag(_e) {
    // Crea primero un div para que tenga el marquito de noContainer
    let iconDiv = new Hueso(createDiv(), "iconito, noContainer", this.innerDiv);

    // Crea un nuevo ícono y lo abre con el IconMenu ya desplegado
    let nuevoIcon = new HuesoIcon("test", "happy", iconDiv, true);
    nuevoIcon.pedirCambio(_e);

    // La deja a mano en un array
    this.tags.push(nuevoIcon);
  }
}

// ----------------------------------------------------------------------------CLASE AGREGAR
class Evento_Agregar extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_tipo, _padre) {
    super(createDiv(""), _tipo + " agregar noContainer", _padre);

    this.tipo = _tipo;

    // Hace sus cosas al hacerle click
    this.element.mouseClicked(this.clickSensor.bind(this));

    // Le agrega el dibujito
    this.icon = new Hueso(createDiv("+"), "agregar_plus", this);

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
