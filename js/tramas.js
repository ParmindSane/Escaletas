// ----------------------------------------------------------------------------CLASE APORTE
class HuesoTrama extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_padre) {
    super(createDiv(), "trama", _padre);

    this.eventos = [];
    this.puntosConectores = [];
    this.conectores = [];

    this.color = "0, 200, 0";

    // Acomodar líneas conectoras
    this.element.elt.addEventListener(
      "dragEventoMoved",
      this.moverConectores.bind(this),
    );

    // Cambiar color
    this.element.elt.addEventListener(
      "tramaCambiarColor",
      this.cambiarColor.bind(this),
    );

    // Borrar evento
    this.element.elt.addEventListener(
      "borrarEvento",
      this.borrarEvento.bind(this),
    );
  }

  // ----------------------------------------------------------------------------AGREGAR EVENTO
  nuevoEvento(_e) {
    // Crear nuevo Evento
    let ne = new HuesoEvento(round(_e.offsetX), round(_e.offsetY), this);
    this.eventos.push(ne);
    let i = this.eventos.indexOf(ne);

    // Guardar conectores del Evento
    this.consultarConectores(ne);

    // Si hay más de un Evento, crea un conector entre el nuevo y el anterior
    // Cada conector vincula el Evento de su mismo index con el siguiente
    if (i > 0) {
      this.conectores[i - 1] = new Trama_Conector(
        this.puntosConectores[i - 1].pos,
        this.puntosConectores[i].pre,
        this,
      );
    }
  }

  // ----------------------------------------------------------------------------PEDIR PUNTOS CONECTORES A EVENTO
  consultarConectores(_evento) {
    // Le pide a un Evento los puntos para conectarlo
    let i = this.eventos.indexOf(_evento);
    this.puntosConectores[i] = _evento.getConectores();
  }

  // ----------------------------------------------------------------------------ACTUALIZAR CONECTORES
  moverConectores(_e) {
    let t = _e.target.hueso;

    let i = this.eventos.indexOf(t);

    // Busca los puntos del Evento movido
    this.consultarConectores(t);

    // Actualiza los conectores del Evento movido, hacia atrás y hacia adelante
    // Sólo cambia los puntos de este Evento, los otros quedan igual
    // Salvo que sea el primero o el último de la lista porque jaja arrays go brr
    if (i > 0) {
      this.conectores[i - 1].dibujar(
        this.puntosConectores[i - 1].pos,
        this.puntosConectores[i].pre,
      );
    }
    if (i < this.conectores.length) {
      this.conectores[i].dibujar(
        this.puntosConectores[i].pos,
        this.puntosConectores[i + 1].pre,
      );
    }
  }

  // ----------------------------------------------------------------------------CAMBIAR COLOR
  cambiarColor() {
    this.color = "200, 0, 0";

    for (let i = 0; i < this.eventos.length; i++) {
      this.eventos[i].cambiarColor(this.color);

      if (this.conectores[i]) {
        this.conectores[i].dibujar();
      }
    }
  }

  // ----------------------------------------------------------------------------BORRAR EVENTO SELECCIONADO
  borrarEvento(_e) {
    let h = _e.target.hueso;

    if (this.contieneTarget(_e)) {
      // Eliminar eventos globales asociados
      document.removeEventListener("mousemove", h.mouseMoved.bind(h));
      document.removeEventListener("mouseup", h.mouseUp.bind(h));

      // Eliminar el Hueso del array
      let i = this.eventos.indexOf(h);
      this.eventos.splice(i, 1);

      // Elimina el conector de su mismo index y conecta los Eventos vecinos (si tiene)
      this.puntosConectores.splice(i, 1);
      if (i < this.conectores.length) {
        this.conectores[i].element.remove();
        this.conectores.splice(i, 1);

        if (i > 0) {
          this.conectores[i - 1].dibujar(
            this.puntosConectores[i - 1].pos,
            this.puntosConectores[i].pre,
          );
        }
      } else {
        this.conectores[i - 1].element.remove();
        this.conectores.splice(i - 1, 1);
      }

      // Borrar el HTML
      h.element.remove();
    }

    // El objeto sólo se borra si ya no tiene referencias en ejecución,
    // así que recemos para que esto sea suficiente (?
  }
}

// ----------------------------------------------------------------------------CLASE CONECTOR
class Trama_Conector extends HuesoFlotante {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_punto0, _punto1, _padre) {
    super(createDiv(), "tramaConector", _padre);

    this.punto0 = _punto0;
    this.punto1 = _punto1;

    this.color = this.padre.color;

    this.margen = 16;

    this.dibujar(_punto0, _punto1);
  }

  // ---------------------------------------------------------------DIBUJAR LÍNEA
  dibujar(_punto0, _punto1) {
    // Con el parámetro "false" se evita actualizar uno de los puntos
    this.punto0 = _punto0 ? _punto0 : this.punto0;
    this.punto1 = _punto1 ? _punto1 : this.punto1;

    // Calcula la distancia horizontal y vertical entre los puntos
    let distX = this.punto1.x - this.punto0.x;
    let distY = this.punto1.y - this.punto0.y;

    // Esto mantiene los puntos de la línea en donde corresponde cuando se mueven
    // Y contrarresta el margen adicional, para que el borde del contenedor no se coma el dibujo
    let x1 = (distX < 0 ? Math.abs(distX) : 0) + this.margen;
    let y1 = (distY < 0 ? Math.abs(distY) : 0) + this.margen;
    let x2 = (distX > 0 ? Math.abs(distX) : 0) + this.margen;
    let y2 = (distY > 0 ? Math.abs(distY) : 0) + this.margen;

    // Actualiza el color
    this.color = this.padre.color;

    // Construye la flecha
    this.contenido =
      "<svg width=" +
      (Math.abs(distX) + this.margen * 2) +
      " height=" +
      (Math.abs(distY) + this.margen * 2) +
      " > <line x1=" +
      x1 +
      " y1=" +
      y1 +
      " x2=" +
      x2 +
      " y2=" +
      y2 +
      ' stroke="rgb(' +
      this.color +
      ')" stroke-width="8" /> </svg>';
    this.element.html(this.contenido);

    // Acomoda la caja cuando se mueven los Eventos que conecta
    let puntoMenorX = Math.min(this.punto0.x, this.punto1.x);
    let puntoMenorY = Math.min(this.punto0.y, this.punto1.y);
    this.mover(puntoMenorX - this.margen, puntoMenorY - this.margen);
  }
}
