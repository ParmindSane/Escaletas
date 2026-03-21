// ----------------------------------------------------------------------------CLASE MENÚ CONTEXTUAL
class ContextMenu extends HuesoSummonMenu {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(select("#contextMenu"));

    this.context = [];
    this.buttons = [];

    //Invocar este menú contextual en vez del default
    document.addEventListener("contextmenu", this.summon.bind(this));

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
    this.ocultar(true);
  }

  // ---------------------------------------------------------------SENSOR DE DRAGSCROLL
  dragscrollSensor(_b) {
    // Impide que se invoque si se acaba de dragscrollear
    // (Ambas cosas son con el click derecho y se confunde el pobre)
    this.dragscrolled = _b;

    // Esconde el menú al dragscrollear
    if (this.dragscrolled) {
      this.ocultar(true);
    }
  }

  // ---------------------------------------------------------------INVOCAR
  summon(_e) {
    _e.preventDefault(); // Prevents the default right-click menu

    if (!this.dragscrolled) {
      let primerHueso;

      // Lo esconde y borra lo anterior antes de invocar uno nuevo
      this.ocultar(true);

      // Confirma que el objeto es un contexto válido y lo guarda en la lista
      // Sube por su árbol genealógico buscando más contextos
      // Deja de buscar cuando llega a un objeto sin padre o marcado como sin contexto.
      let isNoContext = false;
      for (let i = _e.target; !isNoContext; i = i.parentElement) {
        isNoContext = i.classList.contains("noContext") || !i.parentElement;

        if (i.hueso) {
          // Guarda el primer hueso que encuentra, por si sirve para algo ah
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
        // this.invocado = true;

        // Crea una sección de menú por cada contexto en la familia
        for (let c of this.context) {
          let div = createDiv();
          div.parent(this.element);
          div.addClass("contexto_" + this.context.indexOf(c));

          // Crea un botón con los datos de cada opción del objeto
          for (let o of c.contextOptions) {
            let butt = createButton(o.texto);
            butt.parent(div);
            butt.mouseClicked(o.ejecutar.bind(o, _e));
            butt.addClass("menuOption noContext");
            butt.elt.objetivo = c;
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
          butt.addClass("menuOption noContext");
          this.buttons.push(butt);
        }

        // Mostrar menú contextualizado
        this.summonAt(_e.clientX, _e.clientY);
      } else {
        // Si no hay opciones válidas, se vuelve a esconder por las dudas
        // Se quedaba bug al intentar invocarlo sobre sí mismo ah
        this.ocultar(true);
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
  ejecutar(_e) {
    this.hueso.element.elt.dispatchEvent(
      new CustomEvent(this.event, {
        detail: {
          original_e: _e,
        },
        bubbles: true, // Allows the event to bubble up the DOM
        cancelable: true, // Allows the event's default action to be prevented
      }),
    );
  }
}

// ----------------------------------------------------------------------------CLASE MENÚ DE ICONITOS
class IconMenu extends HuesoSummonMenu {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(select("#iconMenu"));

    this.optionDivs = [];
    this.optionButts = [];
    this.optionIcons = [];

    // Crea de antemano todos los posibles botones
    this.iconTypes = ["test", "test2"];
    for (let t of this.iconTypes) {
      this.crearOpciones(t);
    }

    // Invocar cuando lo llama un iconito editable
    window.addEventListener("iconMenu", this.summon.bind(this));
  }

  // ---------------------------------------------------------------INVOCAR
  summon(_e) {
    let h = _e.target.hueso;

    // Muestra el div que corresponde y oculta los demás
    // según el tipo de ícono que se pide
    for (let t of this.optionDivs) {
      let te = t.element;
      if (te.class().includes("icons_" + h.tipo + " ")) {
        te.removeClass("oculto");

        // Vincula cada botón con el ícono invocador
        for (let i in this.optionButts[h.tipo]) {
          let b = this.optionButts[h.tipo][i].element;
          b.elt.objetivo = h;
          b.mouseClicked(false);
          b.mouseClicked(
            this.ejecutar.bind(this, _e.target, this.optionIcons[h.tipo][i]),
          );
        }
      } else {
        te.addClass("oculto");
      }
    }

    // Mostrar donde corresponde
    this.summonAt(_e.detail.mouseX, _e.detail.mouseY);
  }

  // ---------------------------------------------------------------MANDAR EVENTO ASOCIADO
  // Le responde al ícono invocador enviando su nuevo símbolo
  ejecutar(_para, _icon) {
    _para.dispatchEvent(
      new CustomEvent("iconChange", {
        detail: {
          icon: _icon,
        },
        bubbles: true, // Allows the event to bubble up the DOM
        cancelable: true, // Allows the event's default action to be prevented
      }),
    );
  }

  // ---------------------------------------------------------------BUSCAR ÍCONOS
  // Es async para no trabar el programa mientras carga los archivos
  // Puede tardar un cachito...
  async crearOpciones(_file) {
    // Esto me da acceso al código del .svg, no me preguntes cómo
    const response = await fetch("../assets/icons/" + _file + ".svg");
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

    // Crear un div para este tipo de ícono
    let div = new Hueso(
      createDiv(),
      "icons_" + _file + " iconGroup oculto",
      this,
    );
    this.optionDivs.push(div);

    // Crear un botón por cada ícono de este tipo
    this.optionButts[_file] = [];
    this.optionIcons[_file] = [];
    let symbols = svgDoc.querySelectorAll("symbol");
    symbols.forEach((symbol) => {
      let butt = new Hueso(createDiv(), "menuOption", div);

      let iconDiv = new Hueso(createDiv(), "icon_container", butt);
      let icon = new HuesoIcon(_file, symbol.id, iconDiv, false);

      /* FALTA PONERLE UNA DESCRIPCIÓN A CADA ÍCONO */
      let text = createP(_file + ": " + symbol.id);
      text.parent(butt.element);

      // Deja a mano los botones en un array
      this.optionButts[_file][symbol.id] = butt;
      this.optionIcons[_file][symbol.id] = icon.content;
    });

    this.actualizarTam();
  }
}
