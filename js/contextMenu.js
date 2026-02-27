// ----------------------------------------------------------------------------CLASE MENÚ CONTEXTUAL
class ContextMenu extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(select("#contextMenu"));

    this.context = [];
    this.buttons = [];
    this.invocado = false;

    //Invocar este menú contextual en vez del default
    document.addEventListener("contextmenu", this.summon.bind(this));

    //cerrar menú con la siguiente acción del mouse
    document.addEventListener("mousedown", this.mouseSensor.bind(this));
    document.addEventListener("wheel", this.mouseSensor.bind(this));
    document.addEventListener("click", this.ocultar.bind(this));

    // evita que se invoque el menú al hacer dragscroll
    this.dragscrolled = false;
    document.addEventListener(
      "dragscrollStart",
      this.dragscrollSensor.bind(this, true),
    );
    document.addEventListener(
      "dragscrollEnd",
      this.dragscrollSensor.bind(this, false),
    );

    // Lo esconde recién ahora para que pueda tomar los datos del estilo
    this.ocultar();
  }

  // ---------------------------------------------------------------SENSOR DE DRAGSCROLL
  dragscrollSensor(_b) {
    // Impide que se invoque si se acaba de dragscrollear
    // (Ambas cosas son con el click derecho y se confunde el pobre)
    this.dragscrolled = _b;

    // Esconde el menú al dragscrollear
    if (this.dragscrolled) {
      this.ocultar();
    }
  }

  // ---------------------------------------------------------------INVOCAR
  summon(_e) {
    _e.preventDefault(); // Prevents the default right-click menu

    if (!this.dragscrolled) {
      let primerHueso;
      
      // Lo esconde y borra lo anterior antes de invocar uno nuevo
      this.ocultar();

      // Confirma que el objeto es un contexto válido y lo guarda en la lista
      // Sube por su árbol genealógico buscando más contextos
      // Deja de buscar cuando llega a un objeto sin padre o marcado como sin contexto.
      let isNoContext = false;
      for (let i = _e.target; !isNoContext; i = i.parentElement) {
        isNoContext = i.classList.contains("noContext") || !i.parentElement;

        if (i.hueso) {
          if (!primerHueso) {
            primerHueso = i.hueso;
          }

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

        // Botón de debug para inspeccionar
        if (DEBUG) {
          let div = createDiv();
          div.parent(this.element);
          div.addClass("contexto_DEBUG");

          let butt = createButton("Inspeccionar");
          butt.parent(div);
          let f = function (_p) {
            console.log(_p);
          };
          butt.mouseClicked(f.bind(this, primerHueso));
          butt.addClass("menuOption");
          this.buttons.push(butt);
        }

        // Mostrar el menú
        this.element.removeClass("oculto");
        this.moverA(0, 0);
        this.actualizarTam();

        // Evitar que se salga de la pantalla por la derecha
        // (por la izquierda no hace falta porque siempre se dibuja a la derecha del cursor)
        let cx = _e.clientX + 4;
        let margin = this.tamX + 16;
        let dist = windowWidth - cx;
        if (dist < margin) {
          cx -= margin - dist;
        }
        // Y por arriba o abajo
        let cy = _e.clientY;
        margin = this.tamY + 16;
        dist = windowHeight - cy;
        if (dist < margin) {
          cy -= margin - dist;
        } else if (cy < margin) {
          cy += margin - cy;
        }

        // Acomodar posición
        this.moverA(cx, cy);
      } else {
        // Si no hay opciones válidas, se vuelve a esconder por las dudas
        // Se queda bug si intentás invocarlo sobre sí mismo ah
        this.ocultar();
      }
    }
  }

  // ---------------------------------------------------------------OCULTAR
  ocultar() {
    this.invocado = false;

    // Vaciar
    this.context = [];
    this.buttons = [];
    this.element.html(" ");

    // Esconder
    this.element.addClass("oculto");
  }

  // ---------------------------------------------------------------OCULTAR POR CLICK EXTERNO
  mouseSensor(_e) {
    // Oculta el menú si se usa el mouse fuera de él mientras está invocado
    if (this.invocado) {
      if (!this.contieneTarget(_e)) {
        this.ocultar();
      }
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
