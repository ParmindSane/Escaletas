// ----------------------------------------------------------------------------CLASE EVENTO
class HuesoEvento extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_x, _y, _padre) {
    super(createDiv(), "evento", _padre);
    this.moverA(_x, _y);

    this.vistaDetallada = true;
    this.seleccionado = true;

    // Cosas para hacer el Evento draggeable
    // (Algunos eventos son con base document por si el mouse se sale del área mientras draggea)
    this.dragClick = false;
    this.dragging = false;
    this.dragged = false;
    this.dragData = { px: 0, py: 0, mx: 0, my: 0 };
    this.element.mousePressed(this.mouseDown.bind(this));
    document.addEventListener("mousemove", this.mouseMoved.bind(this));
    document.addEventListener("mouseup", this.mouseUp.bind(this));

    // Detectar cuando empieza y termina un input dentro del Evento
    this.canDrag = true;
    this.inputSensor = function (_b) {
      this.canDrag = _b;
    };
    this.element.elt.addEventListener(
      "inputAbierto",
      this.inputSensor.bind(this, false),
    );
    this.element.elt.addEventListener(
      "inputCerrado",
      this.inputSensor.bind(this, true),
    );

    // Contacto directo con los objetos que sólo se muestran al seleccionar el Evento
    this.ocultables = [];
    let f = function (_e) {
      this.ocultables.push(_e.target);
    };
    this.element.elt.addEventListener("holaSoyOcultable", f.bind(this));

    // Datos de la escaleta
    this.datos = {
      title: "",
      resumen: "",
      index: 0,
      tiempo: 0,
      lugar: "",
      tension: 0,
      tags: [],
      personajes: [],
      aportes: [], //ARREGLO DE DOS DIMENSIONES: [PERSONAJE][DATO] (el personajes.length sería el general)
    };

    // ---------------------------------------------------------------NODO PRINCIPAL
    this.mainDiv = new HuesoFlotante(createDiv(), "eventoMain", this);

    // Lugar
    this.lugarDiv = new Hueso(createDiv(), "perfil", this.mainDiv);

    // Resumen
    this.resumenDiv = new HuesoTexto(
      "Resumen de la acción",
      "resumen textBox noContainer",
      this.mainDiv,
      true,
    );

    // Desfasar el contenido para mantenerlo centrado
    this.mainDiv.actualizarTam();
    this.mainDiv.desfasar(-(this.lugarDiv.tamX + this.resumenDiv.tamX / 2), 0);

    // Aportes
    this.aportesDiv = new Evento_Aportes(this.mainDiv);

    // Acomodar posición cuando cambia su contenido
    this.mainDiv.ajustarTam = function () {
      // this.mainDiv.desfasar(false, this.mainDiv.actualizarTam().y);
    };
    this.mainDiv.element.elt.addEventListener(
      "inputCerrado",
      this.mainDiv.ajustarTam.bind(this),
    );

    // ---------------------------------------------------------------CABEZA DEL NODO PRINCIPAL
    this.headDiv = new HuesoFlotante(createDiv(), "eventoHead", this);
    this.headDiv.headInnerDiv = new Hueso(
      createDiv(),
      "eventoInnerHead",
      this.headDiv,
    );

    // Tiempo
    this.tiempoDiv = new Hueso(
      createDiv(),
      "tiempo noContainer",
      this.headDiv.headInnerDiv,
    );
    this.tiempoDiv.element.html("12:00");

    // Nivel de tensión
    this.tensionDiv = new Evento_Tension(this.headDiv.headInnerDiv);

    // Índice
    this.indexDiv = new Hueso(
      createDiv(),
      "index noContainer",
      this.headDiv.headInnerDiv,
    );
    this.indexDiv.element.html("1/1");

    // El título
    this.titleDiv = new HuesoTexto("Título", "title noContainer", this.headDiv);

    // Desfasar el contenido para mantenerlo centrado.
    this.headDiv.actualizarTam();
    this.headDiv.desfasar(-(this.headDiv.tamX / 2), -this.headDiv.tamY);

    // Acomodar posición cuando cambia su contenido
    this.headDiv.ajustarTam = function (_e) {
      this.headDiv.desfasar(false, -this.headDiv.actualizarTam().y);
    };
    this.headDiv.element.elt.addEventListener(
      "inputCerrado",
      this.headDiv.ajustarTam.bind(this),
    );

    // Puntos para conectar con las otras escenas de la trama
    this.preTramaLink;
    this.posTramaLink;

    // ---------------------------------------------------------------OPCIONES DE MENÚ CONTEXTUAL
    this.newContextOption(
      "eventoEvento",
      "¿Quién soy?",
      this.contextTest1.bind(this),
    );
    this.newContextOption("borrarEvento", "Borrar evento");
  }

  // ---------------------------------------------------------------EVENTOS PARA DRAGGEAR
  mouseDown(_e) {
    // Al pulsar el click izquierdo sobre el objeto
    // Y si no hay inputs abiertos
    if (_e.button === 0 && this.canDrag) {
      this.dragClick = true;
      this.dragged = false;

      // Guardar datos iniciales del mouse
      this.dragData.px = mouseX;
      this.dragData.py = mouseY;
      this.dragData.mx = 0;
      this.dragData.my = 0;
    }
  }
  mouseMoved(_e) {
    // Cuando ya empezó a draggear
    if (this.dragClick || this.dragging) {
      this.dragging = true;
      this.dragClick = false;

      this.element.style("cursor", "grabbing");
      this.element.style("userSelect", "none");

      // Calcular desplazamiento del mouse
      this.dragData.mx = mouseX - this.dragData.px;
      this.dragData.my = mouseY - this.dragData.py;
      this.dragData.px = mouseX;
      this.dragData.py = mouseY;

      // Actualizar posición
      this.moverA(this.posX + this.dragData.mx, this.posY + this.dragData.my);
    }
  }
  mouseUp(_e) {
    // Detener el dragging al soltar el mouse
    if (this.dragging) {
      this.element.style("cursor", "default");
      this.dragged = true;
    } else {
      this.dragged = false;
    }
    this.dragging = false;
    this.dragClick = false;

    // ---------------------------------------------------------------SELECCIONAR EVENTO
    if (!this.dragged) {
      // Detecta si el click fue adentro o afuera del Evento
      let laTieneAdentro = this.contieneTarget(_e);

      // Lo descarta si fue igual que el anterior, así evitamos redundancias
      if (laTieneAdentro != this.seleccionado) {
        let t = _e.target;

        // Si la acción del mouse fue en un menú contextual...
        let fueMiContextMenu = false;
        if (document.getElementById("summonableMenus").contains(t)) {
          // ...y si este Evento es el objetivo del botón pulsado,
          // lo toma como acción interna y no anula la selección
          // Recorre varios objetos por si justo se disparó en un hijo que no lo conoce
          let esteEsElPosta = false;
          let meFuiDeMambo = false;
          for (
            let i = t;
            !esteEsElPosta && !meFuiDeMambo;
            i = i.parentElement
          ) {
            meFuiDeMambo =
              i.classList.contains("noContext") || !i.parentElement;
            esteEsElPosta = i.objetivo;
            if (esteEsElPosta) {
              fueMiContextMenu = this.element.elt.contains(
                i.objetivo.element.elt,
              );
            }
          }
        }

        // Ahora sí: ¿está seleccionado o no?
        this.seleccionado = laTieneAdentro || fueMiContextMenu;

        // Muestra/oculta las opciones adicionales
        this.ocultables.forEach((o) => {
          if (this.seleccionado) {
            o.classList.remove("oculto");
          } else {
            o.classList.add("oculto");
          }
        });
      }
    }
  }

  // ---------------------------------------------------------------AGREGAR APORTE
  nuevoAporte() {}

  // ---------------------------------------------------------------ACCIONES DEL MENÚ CONTEXTUAL
  contextTest1(_e) {
    console.log(this);
  }
}

// ----------------------------------------------------------------------------CREAR EVENTO NUEVO
let eventos = [];
document.addEventListener("crearEvento", function (_e) {
  eventos.push(new HuesoEvento(round(mouseX), round(mouseY), huesoCanvas));
});

// ----------------------------------------------------------------------------BORRAR EVENTO SELECCIONADO
document.addEventListener("borrarEvento", function (_e) {
  let h = _e.target.hueso;

  // Eliminar el Hueso del array
  let i = eventos.indexOf(h);
  eventos.splice(i, 1);

  // Borrar el HTML
  h.element.remove();

  // El objeto sólo se borra y ya no tiene referencias en ejecución,
  // así que recemos para que esto sea suficiente (?
});
