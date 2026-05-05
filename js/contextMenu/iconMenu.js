// ----------------------------------------------------------------------------CLASE MENÚ DE ICONITOS
class IconMenu extends HuesoSummonMenu {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor() {
    super(document.getElementById("iconMenu"));

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
    let h = _e.detail.target;

    // Muestra el div que corresponde y oculta los demás
    // según el tipo de ícono que se pide
    for (let t of this.optionDivs) {
      let te = t.element;
      if (te.classList.contains("icons_" + h.tipo)) {
        te.classList.remove("oculto");

        // Vincula cada botón con el ícono invocador
        for (let i in this.optionButts[h.tipo]) {
          let b = this.optionButts[h.tipo][i].element;
          b.objetivo = h;

          // Arma el método vinculado y guarda una referencia en el botón
          // para desvincularlo cuando se invoca el menú en otro lado
          b.removeEventListener("click", b.targetedEjecutar);
          b.targetedEjecutar = this.ejecutar.bind(
            this,
            h.element,
            this.optionIcons[h.tipo][i],
          );
          b.addEventListener("click", b.targetedEjecutar);
        }
      } else {
        te.classList.add("oculto");
      }
    }

    // Mostrar donde corresponde
    this.summonAt(_e.detail.mouseX, _e.detail.mouseY);
  }

  // ---------------------------------------------------------------MANDAR EVENTO ASOCIADO
  // Le responde al ícono invocador enviando su nuevo símbolo
  ejecutar(_para, _icon) {
    _para.dispatchEvent(
      // this.target.dispatchEvent(
      new CustomEvent("iconChange", {
        detail: {
          icon: _icon,
          // icon: this.targetIcon,
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
      document.createElement("div"),
      "icons_" + _file + " iconGroup oculto",
      this,
    );
    this.optionDivs.push(div);

    // Crear un botón por cada ícono de este tipo
    this.optionButts[_file] = [];
    this.optionIcons[_file] = [];
    let symbols = svgDoc.querySelectorAll("symbol");
    symbols.forEach((symbol) => {
      let butt = new Hueso(document.createElement("div"), "menuOption", div);

      let iconDiv = new Hueso(
        document.createElement("div"),
        "icon_container",
        butt,
      );
      let icon = new HuesoIcon(_file, symbol.id, iconDiv, false);

      /* FALTA PONERLE UNA DESCRIPCIÓN A CADA ÍCONO */
      let text = document.createElement("p");
      text.innerHTML = _file + ": " + symbol.id;
      butt.element.appendChild(text);

      // Deja a mano los botones en un array
      this.optionButts[_file][symbol.id] = butt;
      this.optionIcons[_file][symbol.id] = icon.content;
    });

    this.getTam();
  }
}

// ----------------------------------------------------------------------------CREAR OBJETO MENÚ ICONIAL (?)
let iconMenu;
document.addEventListener("DOMContentLoaded", () => {
  iconMenu = new IconMenu();
});
