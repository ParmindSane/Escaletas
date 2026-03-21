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
    this.slider.hacerOcultable();
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
      "agregar_aporte",
      this.nuevoAporte.bind(this, true),
    );

    this.nuevoAporte(false);
  }

  // ---------------------------------------------------------------AGREGAR APORTE
  nuevoAporte(_startOpen) {
    let a = new Hueso(createDiv(), "aporte noContainer textBox", this.innerDiv);
    a.newContextOption("borrar_aporte", "Borrar aporte", a.borrar.bind(a));

    let t = new HuesoTexto("Dato relevante", "aporte_texto", a, _startOpen);

    let iDiv = new Hueso(createDiv(), "icon_container", a);
    let i = new HuesoIcon("test2", "rombo", iDiv, true);

    this.aportes.push(a);
  }
}

// ----------------------------------------------------------------------------CLASE AGREGAR
class Evento_Agregar extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_tipo, _padre) {
    super(createDiv(""), _tipo + " agregar noContainer", _padre);

    this.tipo = _tipo;

    this.element.mousePressed(this.mouseSensor.bind(this, true));
    this.element.mouseClicked(this.mouseSensor.bind(this, false));

    this.icon = new Hueso(createDiv("+"), "agregar_plus", this);

    this.hacerOcultable();
  }

  // ---------------------------------------------------------------INTERACCIÓN
  mouseSensor(_b) {
    if (_b) {
      // Avisar que el cursor está sobre el botón
      // para que no haga drag y se pulse a la vez
      this.element.elt.dispatchEvent(
        new CustomEvent("inputAbierto", {
          bubbles: true,
          cancelable: true,
        }),
      );
    } else {
      // Avisar que se agregue algo, a quien corresponda
      this.element.elt.dispatchEvent(
        new CustomEvent("agregar_" + this.tipo, {
          bubbles: true,
          cancelable: true,
        }),
      );

      // Avisar que ya se puede draggear
      this.element.elt.dispatchEvent(
        new CustomEvent("inputCerrado", {
          bubbles: true,
          cancelable: true,
        }),
      );
    }
  }
}
