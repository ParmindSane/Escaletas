// ----------------------------------------------------------------------------CLASE P5 -> HTML PARA TEXTO EDITABLE
class HuesoTexto extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_cartel, _clase, _padre, _startOpen) {
    super(document.createElement("div"), _clase + " huesoTexto", _padre);

    this.dato = _cartel;

    // Objeto estático que no se puede editar
    this.eInherte = new Hueso(
      document.createElement("div", this.dato),
      "textBox_inherte",
      this,
    );
    this.eInherte.element.innerHTML = this.dato;

    // Objeto de texto editable
    this.eEditable = new HuesoFlotante(
      document.createElement("textarea"),
      "textBox_editable noContext",
      this,
    );
    this.eEditable.element.innerHTML = this.dato;
    this.eEditable.moverACaja(this.eInherte);

    // ¿Arranca editando o mostrando?
    this.editando = _startOpen;
    if (!this.editando) {
      this.eEditable.element.classList.add("oculto");
    } else {
      // this.eInherte.element.classList.add("oculto");

      // El textarea arranca abierto y con el texto seleccionado
      this.editar(true);
      this.eEditable.element.setSelectionRange(0, this.dato.length);
    }
    this.getTam();

    // Se entra a editar con doble click
    // y se sale usando el mouse fuera del objeto
    this.element.addEventListener("dblclick", this.editar.bind(this));
    document.addEventListener("mousedown", this.mouseSensor.bind(this));
    document.addEventListener("wheel", this.dejarDeEditar.bind(this));

    // Actualizar el tamaño de la caja a medida que se escribe
    this.eEditable.element.addEventListener("input", this.inputTam.bind(this));

    // Entrar al modo edición desde el menú contextual
    this.newContextOption(
      "editarHuesoTexto",
      "Editar texto",
      this.editar.bind(this),
    );
  }

  // ---------------------------------------------------------------ENTRAR EN MODO EDICIÓN
  editar(_b) {
    if (!this.editando || _b) {
      this.editando = true;

      // Esconde el estático y deja el editable seleccionado a la vista
      // (acomoda el tamaño por si quedó muy grande de la vez anterior)
      this.eEditable.element.classList.remove("oculto");
      // this.eEditable.element.size(this.tamX, this.tamY + 16);
      this.eEditable.element.style.width = this.tamX + "px";
      this.eEditable.element.style.height = this.tamY + 16 + "px";
      this.eEditable.element.focus();

      // Avisa que se empezó a editar
      this.element.dispatchEvent(
        new CustomEvent("inputAbierto", {
          bubbles: true, // Allows the event to bubble up the DOM
          cancelable: true, // Allows the event's default action to be prevented
        }),
      );
    }
  }

  // ---------------------------------------------------------------SALIR DEL MODO EDICIÓN
  dejarDeEditar(_e) {
    if (this.editando) {
      this.editando = false;

      // Evita que el texto se quede seleccionado
      this.eEditable.element.selectionEnd = 0;

      // Actualizar dato y tamaño
      this.dato = this.eEditable.element.value;
      this.eInherte.element.innerHTML = this.dato;

      // Oculta el editable y muestra el estático
      // this.eInherte.element.classList.remove("oculto");
      this.eEditable.element.classList.add("oculto");

      // Por si el nuevo texto cambió el tamaño de la caja
      this.getTam();

      // Avisa que se terminó de editar
      this.element.dispatchEvent(
        new CustomEvent("inputCerrado", {
          bubbles: true, // Allows the event to bubble up the DOM
          cancelable: true, // Allows the event's default action to be prevented
        }),
      );
    }
  }

  // ---------------------------------------------------------------DETECTAR EL MOUSE DURANTE LA EDICIÓN
  mouseSensor(_e) {
    // Si se usa el mouse fuera del objeto, sale del modo edición
    if (this.editando) {
      if (!this.contieneTarget(_e)) {
        this.dejarDeEditar();
      }
    }
  }

  // ---------------------------------------------------------------ACTUALIZAR TAMAÑO AL ESCRIBIR
  inputTam() {
    // Guardar el tamaño actual y habilitarlo para cambiar
    let py = parseInt(this.eEditable.element.style.height, 10);
    this.eEditable.element.style.height =
      "auto"; /* Reset height to allow shrinking */
    this.eEditable.element.style.height =
      this.eEditable.element.scrollHeight + "px"; /* Set to the scroll height */

    // Si el nuevo tamaño es mayor, agranda el elemento
    // Si no, lo deja como estaba
    if (py > this.eEditable.element.scrollHeight) {
      this.eEditable.element.style.height = py + "px";
    }
    this.getTam();
  }
}

// ----------------------------------------------------------------------------CLASE P5 -> HTML PARA ICONITOS
class HuesoIcon extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_tipo, _icon, _padre, _editable) {
    super(document.createElement("div"), "iconito", _padre);

    this.icon = _icon;
    this.tipo = _tipo;
    this.description = "Ícono";

    // Establecer ícono inicial
    this.cambiar();

    // Si es un logo que el usuario puede cambiar,
    // invoca las opciones para cambiarlo
    this.editable = _editable;
    if (this.editable) {
      // Llama el menú al hacerle doble click
      this.element.addEventListener("dblclick", this.pedirCambio.bind(this));
      this.element.addEventListener("iconChange", this.cambiar.bind(this));

      // O con un botón del menú contextual
      this.newContextOption(
        "pedirCambio",
        "Cambiar ícono",
        this.pedirCambio.bind(this),
      );
    }
  }

  // ---------------------------------------------------------------DESPLEGAR OPCIONES
  pedirCambio(_e) {
    // Si la llamada fue indirecta (por menú contextual, etc.)
    // tiene que buscar el evento de mouse original en detail
    let e = _e;
    if (!e.clientX) {
      e = _e.detail.original_e;
    }

    // Llama al menú de opciones
    this.element.dispatchEvent(
      new CustomEvent("iconMenu", {
        detail: {
          target: this,
          mouseX: e.clientX,
          mouseY: e.clientY,
        },
        bubbles: true, // Allows the event to bubble up the DOM
        cancelable: true, // Allows the event's default action to be prevented
      }),
    );
  }

  // ---------------------------------------------------------------CAMBIAR ICONITO
  cambiar(_e) {
    // Si no viene ningún parámetro, crea un ícono nuevito de cero.
    if (!_e) {
      this.content =
        '<svg class="icon" width="32" height="32" viewBox="0 0 32 32">' +
        '<use href="./assets/icons/' +
        this.tipo +
        ".svg#" +
        this.icon +
        '"></use>' +
        "</svg>";
    } else {
      // Si hay parámetro, debería ser el evento que viene del menú,
      // así que toma el ícono directamente de ahí para no crearlo otra vez.
      this.content = _e.detail.icon;
    }

    this.element.innerHTML = this.content;
  }
}

// ----------------------------------------------------------------------------CLASE MENÚ DESPLEGABLE
class HuesoSummonMenu extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_select) {
    super(_select);

    this.invocado = false;
    this.justInvocado = false;

    //cerrar menú con la siguiente acción del mouse
    document.addEventListener("mousedown", this.mouseSensor.bind(this));
    document.addEventListener("wheel", this.mouseSensor.bind(this));
    document.addEventListener("click", this.clickSensor.bind(this));
  }

  // ---------------------------------------------------------------INVOCAR
  summonAt(_x, _y) {
    this.invocado = true;
    this.justInvocado = true;

    // Mostrar el menú
    this.element.classList.remove("oculto");
    this.getTam();

    // Evitar que se salga de la pantalla por la derecha
    let cx = _x + 4;
    let margin = this.tamX + 16;
    let dist = window.innerWidth - cx;
    if (dist < margin) {
      cx -= margin - dist;
    }
    // Y por abajo
    let cy = _y;
    margin = this.tamY + 16;
    dist = window.innerHeight - cy;
    if (dist < margin) {
      cy -= margin - dist;
    }

    // Acomodar posición
    this.mover(cx, cy);
  }

  // ---------------------------------------------------------------OCULTAR
  ocultar(_vaciar) {
    this.invocado = false;

    // Vaciar
    if (_vaciar) {
      this.context = [];
      this.buttons = [];
      this.element.textContent = " ";
    }

    // Esconder
    this.element.classList.add("oculto");
  }

  // ---------------------------------------------------------------OCULTAR POR CLICK EXTERNO
  // Oculta el menú si se usa el mouse fuera de él mientras está invocado
  mouseSensor(_e) {
    if (this.invocado) {
      // Registra que ya hubo una acción del mouse desde la última invocación
      this.justInvocado = false;

      if (!this.contieneTarget(_e)) {
        this.ocultar(false);
      }
    }
  }
  // A menos que sea un menú llamando a otro
  // Y sólo si no viene de un botón, para que no se pisen los eventos
  clickSensor(_e) {
    if (this.invocado) {
      let fueEnUnMenu = document
        .getElementById("summonableMenus")
        .contains(_e.target);
      let fuiYoBarry = this.contieneTarget(_e);
      if ((!fueEnUnMenu || fuiYoBarry) && !this.justInvocado) {
        this.ocultar(false);
      }
    }
  }
}
