// ----------------------------------------------------------------------------CLASE MENÚ CONTEXTUAL
class ContextMenu extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(0, 0, "#contextMenu");

    this.context = [];
    this.buttons = [];
    this.invocado = false;

    //Invocar este menú contextual en vez del default
    document.addEventListener("contextmenu", this.summon.bind(this));

    //cerrar menú con el siguiente click tras su invocación
    document.addEventListener("click", this.ocultar.bind(this));

    // cerrar menú con el siguiente dragscroll tras su invocación
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
  summon(_e) {
    if (!DEBUG) {
      _e.preventDefault(); // Prevents the default right-click menu
    }

    if (!this.dragscrolled) {
      // Lo esconde y borra lo anterior antes de invocar uno nuevo
      this.ocultar();

      // Confirma que el objeto es un contexto válido y lo guarda en la lista
      // Sube por su árbol genealógico buscando más contextos
      // Deja de buscar cuando llega a un objeto sin padre o marcado como sin contexto.
      let isNoContext = false;
      for (let i = _e.target; !isNoContext; i = i.parentElement) {
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

      // Si encontró al menos una opción válida, invoca un nuevo menú
      if (this.context.length > 0) {
        this.invocado = true;

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

        // Mostrar el menú
        this.element.removeClass("oculto");
        this.mover(0, 0);

        // Evitar que se salga de la pantalla por la derecha
        // Por la izquierda no hace falta porque siempre se dibuja a la derecha del cursor
        let cx = _e.clientX + this.tamX / 2 + 2;
        let margin = this.tamX * 0.6;
        let dist = windowWidth - cx;
        if (dist < margin) {
          cx -= margin - dist;
        }
        // Y en vertical
        let cy = _e.clientY;
        margin = this.tamY * 0.6;
        dist = windowHeight - cy;
        if (dist < margin) {
          cy -= margin - dist;
        } else if (cy < margin) {
          cy += margin - cy;
        }

        // Acomodar posición
        this.mover(cx, cy);
      } else {
        // Si no hay opciones válidas, se vuelve a esconder por las dudas
        // Se queda bug si intentás invocarlo sobre sí mismo ah
        this.ocultar();
      }
    }
  }

  // ---------------------------------------------------------------OCULTAR
  ocultar() {
    if (this.invocado) {
      this.invocado = false;

      // Vaciar
      this.context = [];
      this.buttons = [];
      this.element.html(" ");

      // Esconder
      this.mover(-this.posX, -this.posY);
      this.element.addClass("oculto");
    }
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
