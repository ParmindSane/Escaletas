// ----------------------------------------------------------------------------CLASE P5 -> HTML
class Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_element, _clases, _padre) {
    // Crearlo como p5.Element facilita algunas funciones en relación al Canvas
    // (se accede al elemento posta con .elt)
    this.element = _element;
    this.padre = _padre;

    // Si crea un elemento nuevo, le aplica los otros parámetros
    if (_clases && _padre) {
      this.element.parent(this.padre.element);
      this.element.addClass(_clases);
    } else {
      // Si usa un elemento que ya existe, toma sus datos
      if (this.element.parent().hueso) {
        this.padre = this.element.parent().hueso;
      }
    }

    // Referencia al Hueso en el Elemento
    // (para cuando se lo accede desde un evento)
    this.element.elt.hueso = this;

    // Guardar tamaño asignado por CSS a la clase. Por defecto es 0
    this.actualizarTam();

    // Dejar preparado un array para las opciones de menú contextual
    this.contextOptions = [];
  }

  // ---------------------------------------------------------------CREAR NUEVA OPCIÓN DE MENÚ CONTEXTUAL
  newContextOption(_evento, _texto, _method) {
    this.contextOptions.push(new ContextOption(this, _evento, _texto));

    // Si se especificó un método, se añade un EventListener local que lo ejecute
    if (_method) {
      this.element.elt.addEventListener(_evento, _method.bind(this));
    }
  }

  // ---------------------------------------------------------------DETECTAR SI EL EVENTO SE DISPARÓ DENTRO DEL OBJETO
  contieneTarget(_e) {
    let t = _e.target;
    return this.element.elt.contains(t) || this.element.elt === t;
  }

  // ---------------------------------------------------------------ACTUALIZAR TAMAÑO DEL ELEMENTO
  actualizarTam() {
    // Guardar acceso rápido al tamaño actual del elemento
    // this.tamX = this.element.size().width;
    // this.tamY = this.element.size().height;
    this.tamX = this.element.elt.clientWidth;
    this.tamY = this.element.elt.clientHeight;

    return { x: this.tamX, y: this.tamY };
  }
}

// ----------------------------------------------------------------------------CLASE P5 -> HTML CON POSICIÓN DEFINIDA
class HuesoFlotante extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_element, _clase, _padre) {
    super(_element, _clase, _padre);

    this.posX = 0;
    this.posY = 0;

    // Si el padre está desfasado, le resta su desfase
    // para tomar de referencia las coordenadas originales del Hueso
    if (this.padre) {
      if (this.padre.desfaseX) {
        this.posX = -this.padre.desfaseX;
        this.posY = -this.padre.desfaseY;
      }
    }

    // Para guardar la posición del Hueso antes de cambiarla
    // Así sé cuánto se movió cada vez
    this.pPosX = this.posX;
    this.pPosY = this.posY;

    // Distancia entre la posición del Hueso y la del elemento
    this.desfaseX = 0;
    this.desfaseY = 0;

    this.moverA(0, 0);
  }

  // ---------------------------------------------------------------CAMBIAR POSICIÓN DEL HUESO
  moverA(_x, _y) {
    // Guardar posición anterior
    this.pPosX = this.posX;
    this.pPosY = this.posY;

    // Si tiene un padre definido, toma de referencia a su Hueso para las coordenadas
    // (por defecto toma el 0;0 del lemento, que no tiene por qué ser el mismo)
    let refeX = 0;
    let refeY = 0;
    if (this.padre) {
      if (this.padre.desfaseX) {
        refeX = -this.padre.desfaseX;
        refeY = -this.padre.desfaseY;
      }
    }

    // Si no se da un parámetro, se queda donde estaba
    // (para no tener que escribir hueso.pos cada vez)
    if (_x) {
      this.posX = refeX + _x;
    }
    if (_y) {
      this.posY = refeY + _y;
    }

    // Actualiza la ubicación del elemento manteniendo su posición relativa al Hueso
    this.desfasar(false, false);
  }

  // ---------------------------------------------------------------CAMBIAR POSICIÓN DEL HTML RESPECTO AL HUESO
  desfasar(_x, _y) {
    // Si no se da un parámetro de desfase, se queda como estaba
    // (para no tener que escribir hueso.desfase cada vez)
    if (_x) {
      this.desfaseX = _x;
    }
    if (_y) {
      this.desfaseY = _y;
    }

    // Mover el elemento sin afectar al Hueso
    this.element.position(this.posX + this.desfaseX, this.posY + this.desfaseY);
  }
}

// ----------------------------------------------------------------------------CLASE P5 -> HTML PARA TEXTO EDITABLE
class HuesoTexto extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_cartel, _clase, _padre) {
    super(createDiv(), _clase + " huesoTexto", _padre);

    this.dato = _cartel;
    this.editando = false;

    // Objeto estático que no se puede editar
    this.eInherte = createDiv(this.dato);
    this.eInherte.parent(this.element);
    this.eInherte.style("userSelect", "none");

    // Objeto de texto editable
    this.eEditable = createElement("textarea", this.dato);
    this.eEditable.parent(this.element);
    this.eEditable.addClass("oculto");

    // Se entra a editar con doble click
    // y se sale usando el mouse fuera del objeto
    this.element.doubleClicked(this.editar.bind(this));
    document.addEventListener("mousedown", this.mouseSensor.bind(this));
    document.addEventListener("wheel", this.dejarDeEditar.bind(this));

    // Actualizar el tamaño de la caja a medida que se escribe
    this.eEditable.input(this.inputTam.bind(this));

    this.actualizarTam();
  }

  // ---------------------------------------------------------------ENTRAR EN MODO EDICIÓN
  editar(_e) {
    if (!this.editando) {
      this.editando = true;

      // Esconde el estático y deja el editable seleccionado a la vista
      // (acomoda el tamaño por si quedó muy grande de la vez anterior)
      this.eInherte.addClass("oculto");
      this.eEditable.removeClass("oculto");
      this.eEditable.size(this.tamX, this.tamY + 16);
      this.eEditable.elt.focus();

      // Avisa que se empezó a editar
      this.element.elt.dispatchEvent(
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

      // Actualizar dato y tamaño
      this.dato = this.eEditable.value();
      console.log(this.dato);
      this.eInherte.html(this.dato);

      // Oculta el editable y muestra el estático
      this.eEditable.addClass("oculto");
      this.eInherte.removeClass("oculto");

      // Por si el nuevo texto cambió el tamaño de la caja
      this.actualizarTam();

      // Avisa que se terminó de editar
      this.element.elt.dispatchEvent(
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
    let py = int(this.eEditable.elt.style.height);
    this.eEditable.elt.style.height =
      "auto"; /* Reset height to allow shrinking */
    this.eEditable.elt.style.height =
      this.eEditable.elt.scrollHeight + "px"; /* Set to the scroll height */

    // Si el nuevo tamaño es mayor, agranda el elemento
    // Si no, lo deja como estaba
    if (py > this.eEditable.elt.scrollHeight) {
      this.eEditable.elt.style.height = py + "px";
    }
  }
}

// ----------------------------------------------------------------------------CLASE P5 -> HTML PARA ICONITOS
class HuesoIcon extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_tipo, _icon, _padre, _editable) {
    super(createDiv(), "iconito", _padre);

    this.icon = _icon;
    this.tipo = _tipo;

    this.cambiar();

    // Si es un logo que el usuario puede cambiar,
    // invoca las opciones al hacerle doble click
    this.editable = _editable;
    if (this.editable) {
      this.element.doubleClicked(this.pedirCambio.bind(this));
      this.element.elt.addEventListener("iconChange", this.cambiar.bind(this));
    }
  }

  // ---------------------------------------------------------------DESPLEGAR OPCIONES
  pedirCambio(_e) {
    // Llama al menú de opciones
    this.element.elt.dispatchEvent(
      new CustomEvent("iconMenu", {
        detail: {
          target: this,
          mouseX: _e.clientX,
          mouseY: _e.clientY,
        },
        bubbles: true, // Allows the event to bubble up the DOM
        cancelable: true, // Allows the event's default action to be prevented
      }),
    );
  }

  // ---------------------------------------------------------------CAMBIAR ICONITO
  cambiar(_e) {
    // Si no viene ningún parámetro, crea un ícono nuevito de cero.
    // Si hay parámetro, debería ser el evento que viene del menú,
    // así que le asigna directamente el ícono para no tener que crearlo otra vez.
    if (_e) {
      this.content = _e.detail.icon;
    } else {
      // Traté de generarlo como p5.Element
      // pero cargaba mal la ruta y me dio paja xd
      this.content =
        '<svg class="icon" width="32" height="32" viewBox="0 0 32 32">' +
        '<use href="./assets/icons/' +
        this.tipo +
        ".svg#" +
        this.icon +
        '"></use>' +
        "</svg>";
    }

    this.element.html(this.content);
  }
}

// ----------------------------------------------------------------------------CLASE MENÚ DESPLEGABLE
class HuesoSummonMenu extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_select) {
    super(_select);

    this.invocado = false;

    //cerrar menú con la siguiente acción del mouse
    document.addEventListener("mousedown", this.mouseSensor.bind(this));
    document.addEventListener("wheel", this.mouseSensor.bind(this));
    document.addEventListener("click", this.ocultar.bind(this, false));
  }

  // ---------------------------------------------------------------INVOCAR
  summonAt(_x, _y) {
    this.invocado = true;

    // Mostrar el menú
    this.element.removeClass("oculto");
    this.actualizarTam();

    // Evitar que se salga de la pantalla por la derecha
    let cx = _x + 4;
    let margin = this.tamX + 16;
    let dist = windowWidth - cx;
    if (dist < margin) {
      cx -= margin - dist;
    }
    // Y por abajo
    let cy = _y;
    margin = this.tamY + 16;
    dist = windowHeight - cy;
    if (dist < margin) {
      cy -= margin - dist;
    }

    // Acomodar posición
    this.moverA(cx, cy);
  }

  // ---------------------------------------------------------------OCULTAR
  ocultar(_vaciar) {
    this.invocado = false;

    // Vaciar
    if (_vaciar) {
      this.context = [];
      this.buttons = [];
      this.element.html(" ");
    }

    // Esconder
    this.element.addClass("oculto");
  }

  // ---------------------------------------------------------------OCULTAR POR CLICK EXTERNO
  mouseSensor(_e) {
    // Oculta el menú si se usa el mouse fuera de él mientras está invocado
    if (this.invocado) {
      if (!this.contieneTarget(_e)) {
        this.ocultar(false);
      }
    }
  }
}
