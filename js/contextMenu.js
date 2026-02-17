// ----------------------------------------------------------------------------CLASE MENÚ CONTEXTUAL
class ContextMenu {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    this.element = select("#contextMenu");

    this.context = [];
    this.buttons = [];
    this.invocado = false;

    //Invocar este menú contextual en vez del default
    document.addEventListener("contextmenu", this.summon.bind(this));

    //cerrar menú con el siguiente click o dragscroll tras su invocación
    document.addEventListener("click", this.ocultar.bind(this));

    this.dragscrolled = false;
    document.addEventListener(
      "dragscrollStart",
      this.dragscrollSensor.bind(this, true),
    );
    document.addEventListener(
      "dragscrollEnd",
      this.dragscrollSensor.bind(this, false),
    );
  }

  // ---------------------------------------------------------------SENSOR DE DRAGSCROLL
  dragscrollSensor(_b) {
    this.dragscrolled = _b;

    // Esconde el menú al dragscrollear
    if (this.dragscrolled) {
      this.ocultar();
    }
  }

  // ---------------------------------------------------------------INVOCAR
  summon(e) {
    if (!DEBUG) {
      e.preventDefault(); // Prevents the default right-click menu
    }

    if (!this.dragscrolled) {
      this.vaciar();

      // Confirma que el objeto es un contexto válido y lo guarda en la lista
      // Sube por su árbol genealógico buscando más contextos
      // Deja de buscar cuando llega a un objeto sin padre o marcado como sin contexto.
      let isNoContext = false;
      for (let i = e.target; !isNoContext; i = i.parentElement) {
        isNoContext = i.classList.contains("noContext") || !i.parentElement;

        if (i.hueso) {
          let tieneOpciones = i.hueso.contextOptions.length > 0;
          let nuevoEnLista = this.context.indexOf(i.hueso) < 0;
          if (tieneOpciones && nuevoEnLista) {
            this.context.push(i.hueso);
          }
        }
      }
      console.log(this.context);

      // Si se encontró al menos una opción válida, invoca un nuevo menú
      if (this.context.length > 0) {
        this.invocado = true;

        // Mostrar el menú en el lugar correcto
        this.element.position(e.clientX, e.clientY); // ¿CÓMO EVITAR QUE SE SALGA DE LA PANTALLA?
        this.element.removeClass("oculto");

        // Crea una sección de menú por cada contexto en la familia
        for (let c of this.context) {
          let div = createDiv();
          div.parent(this.element);
          div.addClass("contexto_" + this.context.indexOf(c));

          // Crea un botón con los datos de cada opción del objeto
          for (let o of c.contextOptions) {
            let butt = createButton(o.texto);
            butt.parent(div);
            butt.mouseClicked(o.ejecutar.bind(o));
            butt.addClass("menuOption");
            this.buttons.push(butt);
          }
        }
      }
    }
  }

  // ---------------------------------------------------------------OCULTAR
  ocultar() {
    if (this.invocado) {
      this.invocado = false;
      this.vaciar();
      this.element.addClass("oculto");
    }
  }

  // ---------------------------------------------------------------VACIAR
  vaciar() {
    this.context = [];
    this.buttons = [];
    this.element.html(" ");
  }
}

// ----------------------------------------------------------------------------CLASE OPCIÓN DEL MENÚ CONTEXTUAL
class ContextOption {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_hueso, _event, _texto) {
    this.hueso = _hueso;
    this.event = _event;
    this.texto = _texto;
  }

  // ---------------------------------------------------------------MANDAR EVENTO ASOCIADO
  ejecutar() {
    let h = this.hueso;
    this.hueso.element.elt.dispatchEvent(
      new CustomEvent(this.event, {
        detail: {
          hueso: h,
        },
        bubbles: true, // Allows the event to bubble up the DOM
        cancelable: true, // Allows the event's default action to be prevented
      }),
    );
  }
}
