// ----------------------------------------------------------------------------CLASE MENÚ CONTEXTUAL
class ContextMenu extends HuesoSummonMenu {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(document.getElementById("contextMenu"));

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
        // Crea una sección de menú por cada contexto en la familia
        for (let c of this.context) {
          let div = document.createElement("div");
          this.element.appendChild(div);
          div.classList.add("contexto_" + this.context.indexOf(c));

          // Crea un botón con los datos de cada opción del objeto
          for (let o of c.contextOptions) {
            let butt = document.createElement("button");
            butt.innerHTML = o.texto;
            div.appendChild(butt);
            butt.addEventListener("click", o.ejecutar.bind(o, _e));
            butt.classList.add("menuOption", "noContext");
            butt.objetivo = c;
            this.buttons.push(butt);
          }
        }

        // Botón de debug para inspeccionar
        if (DEBUG) {
          let div = document.createElement("div");
          this.element.appendChild(div);
          div.classList.add("contexto_DEBUG");

          let butt = document.createElement("button");
          butt.innerHTML = "Inspeccionar";
          div.appendChild(butt);
          let f = function (_p) {
            console.log(_p);
          };
          butt.addEventListener("click", f.bind(this, primerHueso));
          butt.classList.add("menuOption", "noContext");
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
    this.hueso.element.dispatchEvent(
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

// ----------------------------------------------------------------------------CREAR OBJETO MENÚ CONTEXTUAL
let contextMenu;
document.addEventListener("DOMContentLoaded", () => {
  contextMenu = new ContextMenu();
});
