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
    this.inputAbierto = true;
    this.inputSensor = function (_b) {
      this.inputAbierto = _b;
      this.centrar();
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
    this.element.elt.addEventListener(
      "holaSoyOcultable",
      this.guardarOcultable.bind(this),
    );

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
      aportes: [], //[NODO][DATO]
    };

    // ---------------------------------------------------------------NODO PRINCIPAL
    this.nodos = [];

    this.mainDiv = new HuesoFlotante(
      createDiv(),
      "eventoMain eventoNodo",
      this,
    );
    this.nodos[0] = this.mainDiv;
    this.nodoActivo = this.mainDiv;

    // Tags
    this.tagsDiv = new Evento_Tags("evento", this.mainDiv);

    // Lugar
    this.lugarDiv = new Hueso(createDiv(), "perfil noContainer", this.mainDiv);

    // Resumen
    this.resumenDiv = new HuesoTexto(
      "Resumen de la acción",
      "resumen textBox noContainer",
      this.mainDiv,
      true,
    );

    // Aportes
    this.aportesDiv = new Evento_Aportes(this.mainDiv);

    // Botón de agregar nodo
    this.agregarPersonaje = new Evento_Conector(this);
    this.personajesDiv = new Hueso(createDiv(), "eventoPersonajes", this);

    // Acomodar las posiciones de las cosas cuando se agrega o borra algo
    this.centrar();
    this.element.elt.addEventListener("borrar", this.centrar.bind(this));
    this.element.elt.addEventListener(
      "agregar",
      this.nuevoPersonaje.bind(this),
    );

    // ---------------------------------------------------------------CABEZA DEL NODO PRINCIPAL
    this.headDiv = new HuesoFlotante(createDiv(), "eventoHead", this.mainDiv);
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

    // ---------------------------------------------------------------CONECTORES
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
    // Si no hay inputs abiertos
    // Ni estás parado sobre un ocultable
    let paradoSobreOcultable = false;
    for (let i = 0; i < this.ocultables.length && !paradoSobreOcultable; i++) {
      paradoSobreOcultable = this.ocultables[i].hueso.contieneTarget(_e);
    }
    if (_e.button === 0 && this.inputAbierto && !paradoSobreOcultable) {
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
    if (!this.dragged && _e.button === 0) {
      // Detecta si el click fue adentro o afuera del Evento
      let laTieneAdentro = this.contieneTarget(_e);

      // // Lo descarta si fue igual que el anterior, así no ejecuta lo demás al pedo
      // if (laTieneAdentro != this.seleccionado) {
      let t = _e.target;

      // Si la acción del mouse fue en un menú contextual...
      let fueMiContextMenu = false;
      if (!laTieneAdentro) {
        if (document.getElementById("summonableMenus").contains(t)) {
          // ...y si este Evento es el objetivo del botón pulsado,
          // lo toma como acción interna y no anula la selección
          // Recorre varios objetos por si justo se disparó en un hijo que no sabe
          let esteEsElQueSabe = false;
          let meFuiDeMambo = false;
          for (
            let i = t;
            !esteEsElQueSabe && !meFuiDeMambo;
            i = i.parentElement
          ) {
            meFuiDeMambo =
              i.classList.contains("noContext") || !i.parentElement;
            esteEsElQueSabe = i.objetivo;
            if (esteEsElQueSabe) {
              t = i.objetivo.element.elt;
              fueMiContextMenu = this.element.elt.contains(t);
            }
          }
        }
      }

      // Ahora sí: ¿está seleccionado o no?
      let meSeleccionaron = laTieneAdentro || fueMiContextMenu;

      // Si no está seleccionado, oculta todos los ocultables
      if (!meSeleccionaron) {
        if (meSeleccionaron != this.seleccionado) {
          this.nodoActivo = false;

          for (let o of this.ocultables) {
            o.classList.add("oculto");
          }
        }
      } else {
        // Si está seleccionado, se fija en cuál nodo fue
        let nodoClickeado = false;
        for (let n of this.nodos) {
          if (n.contieneTarget(t)) {
            nodoClickeado = n;
          }
        }

        // Y muestra los ocultables sólo en ese nodo
        // Además del botón de agregar personaje, que no depende de ninguno
        if (nodoClickeado != this.nodoActivo) {
          for (let o of this.ocultables) {
            // Si el clic fue para agregar un nuevo nodo, oculta todos
            // (el nuevo se crea después de este evento)
            if (
              (nodoClickeado ? nodoClickeado.contieneTarget(o) : false) ||
              this.agregarPersonaje.contieneTarget(o)
            ) {
              o.classList.remove("oculto");
            } else {
              o.classList.add("oculto");
            }
          }

          this.nodoActivo = nodoClickeado;
        }
      }

      this.seleccionado = meSeleccionaron;

      // // Muestra/oculta las opciones adicionales
      // this.ocultables.forEach((o) => {
      //   if (this.seleccionado) {
      //     o.classList.remove("oculto");
      //   } else {
      //     o.classList.add("oculto");
      //   }
      // });

      // Acomoda posiciones que puedan cambiar
      this.centrar();
    }
  }
  // }

  // ---------------------------------------------------------------GUARDAR OCULTABLES
  guardarOcultable = function (_e) {
    let t = _e.target;

    // let seFue = false;
    // for(let i=t; !seFue; i=t.parentElement){

    // }

    this.ocultables.push(t);
  };

  // ---------------------------------------------------------------MANTENER CENTRADO
  centrar() {
    // Desfasar el contenido para mantenerlo centrado
    // Más que nada por el tagsDiv, que mueve todo lo demás cuando se muestra y se oculta
    // ¿Por qué puse un objeto así a la izquierda del todo? :/
    if (this.resumenDiv && this.lugarDiv && this.tagsDiv) {
      this.mainDiv.desfasar(
        -(
          this.tagsDiv.actualizarTam().x +
          this.lugarDiv.actualizarTam().x +
          this.resumenDiv.actualizarTam().x / 2
        ),
        0,
      );

      // También mueve todo lo que hay por abajo del nodo main
      let alturaTotal = this.mainDiv.actualizarTam().y;
      if (this.nodos.length > 1) {
        for (let i = 1; i < this.nodos.length; i++) {
          let p = this.nodos[i];

          alturaTotal += this.agregarPersonaje.tamY;
          p.centrar();
          p.moverA(0, alturaTotal);

          alturaTotal += p.actualizarTam().y;
        }
      }
      this.agregarPersonaje.moverA(0, +alturaTotal);
    }
  }

  // ---------------------------------------------------------------AGREGAR PERSONAJE
  nuevoPersonaje(_e) {
    if (_e.detail.tipo === "participante") {
      // Crear nuevo nodo de personaje
      let i = this.nodos.length;
      this.nodos[i] = new Evento_Personaje(i, this.personajesDiv);

      // Ubicar nodo abajo del todo
      let py = this.agregarPersonaje.posY + this.agregarPersonaje.tamY;
      this.nodos[i].moverA(0, py);
    }

    // Actualizar posición del botoncito de agregar
    this.centrar();
  }

  // ---------------------------------------------------------------ACCIONES DEL MENÚ CONTEXTUAL
  contextTest1(_e) {
    console.log(_e.target);
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

  // Eliminar eventos globales asociados
  document.removeEventListener("mousemove", h.mouseMoved.bind(h));
  document.removeEventListener("mouseup", h.mouseUp.bind(h));

  // Eliminar el Hueso del array
  let i = eventos.indexOf(h);
  eventos.splice(i, 1);

  // Borrar el HTML
  h.element.remove();

  // El objeto sólo se borra si ya no tiene referencias en ejecución,
  // así que recemos para que esto sea suficiente (?
});
