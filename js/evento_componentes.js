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
          bubbles: true, // Allows the event to bubble up the DOM
          cancelable: true, // Allows the event's default action to be prevented
        }),
      );
    } else {
      // Ok ya podés draggear otra vez
      this.slider.element.elt.dispatchEvent(
        new CustomEvent("inputCerrado", {
          bubbles: true, // Allows the event to bubble up the DOM
          cancelable: true, // Allows the event's default action to be prevented
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

  // // ---------------------------------------------------------------MOSTRAR/OCULTAR EL SLIDER
  // selectSensor(_e) {
  //   // Sólo muestra el slider cuando el Evento que lo contiene está seleccionado
  //   if (_e.target.contains(this.element.elt)) {
  //     if (_e.detail.selected) {
  //       this.slider.element.removeClass("oculto");
  //     } else {
  //       this.slider.element.addClass("oculto");
  //     }
  //   }
  // }
}

// ----------------------------------------------------------------------------CLASE APORTE
class Evento_Aporte extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_padre) {
    super(createDiv(), "aporte noContainer textBox", _padre);

    this.texto = new HuesoTexto("Dato relevante", "aporte_texto", this);

    this.iconDiv = new Hueso(createDiv(), "icon_container", this);
    this.iconito = new HuesoIcon("test2", "rombo", this.iconDiv, true);
  }
}

// // ----------------------------------------------------------------------------CLASE AGREGAR
// class Evento_Agregar extends Hueso {
//   // ---------------------------------------------------------------CONSTRUCTOR
//   constructor(_clase, _padre) {
//     super(createDiv(), _clase + " noContainer agregar", _padre);
//   }
// }
