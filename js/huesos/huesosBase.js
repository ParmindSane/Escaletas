// ----------------------------------------------------------------------------CLASE P5 -> HTML
class Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_element, _clases, _padre) {
    this.element = _element;
    this.padre = _padre;

    // Si crea un elemento nuevo, le aplica los otros parámetros
    if (_clases && _padre) {
      this.padre.element.appendChild(this.element);
      this.element.className = _clases;
    } else {
      // Si usa un elemento que ya existe, toma sus datos
      if (this.element.parentElement.hueso) {
        this.padre = this.element.parentElement.hueso;
      }
    }

    // Referencia al Hueso en el Elemento
    // (para cuando se lo accede desde un evento)
    this.element.hueso = this;

    // Guardar tamaño asignado por CSS a la clase. Por defecto es 0
    this.getTam();

    // Dejar preparado un array para las opciones de menú contextual
    this.contextOptions = [];
  }

  // ---------------------------------------------------------------CREAR NUEVA OPCIÓN DE MENÚ CONTEXTUAL
  newContextOption(_evento, _texto, _method) {
    this.contextOptions.push(new ContextOption(this, _evento, _texto));

    // Si se especificó un método, se añade un EventListener local que lo ejecute
    if (_method) {
      this.element.addEventListener(_evento, _method.bind(this));
    }
  }

  // ---------------------------------------------------------------DETECTAR SI CONTIENE EL OBJETO DADO
  contieneTarget(_e) {
    // El parámetro puede ser un objeto o un evento cuyo target es ese objeto
    let t = _e.target ? _e.target : _e;
    return this.element.contains(t) || this.element === t;
  }

  // ---------------------------------------------------------------ACTUALIZAR TAMAÑO DEL ELEMENTO
  getTam() {
    // Guardar acceso rápido al tamaño actual del elemento
    // this.tamX = this.element.size().width;
    // this.tamY = this.element.size().height;
    this.tamX = this.element.clientWidth;
    this.tamY = this.element.clientHeight;

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

    this.mover(0, 0);
  }

  // ---------------------------------------------------------------CAMBIAR POSICIÓN DEL HUESO
  mover(_x, _y) {
    // Guardar posición anterior
    this.pPosX = this.posX;
    this.pPosY = this.posY;

    // Si tiene un padre definido, toma de referencia a su Hueso para las coordenadas
    // (por defecto toma el 0;0 del elemento, que no tiene por qué ser el mismo)
    // let refeX = 0;
    // let refeY = 0;
    // if (this.padre) {
    //   if (this.padre.desfaseX) {
    //     refeX = -this.padre.desfaseX;
    //     refeY = -this.padre.desfaseY;
    //   }
    // }

    // Si no se da un parámetro, se queda donde estaba
    // (para no tener que escribir hueso.pos cada vez)
    if (_x) {
      // this.posX = refeX + _x;
      this.posX = _x;
    }
    if (_y) {
      // this.posY = refeY + _y;
      this.posY = _y;
    }

    // Actualiza la ubicación del elemento manteniendo su posición relativa al Hueso
    this.desfasar(false, false);
  }

  // ---------------------------------------------------------------MOVER HUESO HACIA HTML
  moverACaja(_t) {
    // Funciona con un parámetro que sea un elemento html
    let t = _t;

    if (t.element) {
      // O un hueso
      t = t.element;
    } else if (t.elt) {
      // O un hueso.element
      t = t.elt;
    }

    this.mover(t.offsetLeft, t.offsetTop);
  }

  // ---------------------------------------------------------------MOVER HTML
  desfasar(_x, _y) {
    // Si no se da un parámetro de desfase, se queda como estaba
    // (para no tener que escribir hueso.desfase cada vez)
    if (_x) {
      this.desfaseX = _x;
    }
    if (_y) {
      this.desfaseY = _y;
    }

    // Mueve el elemento sin afectar al Hueso
    // this.element.position(this.posX + this.desfaseX, this.posY + this.desfaseY);
    this.element.style.position = "absolute";
    this.element.style.left = this.posX + this.desfaseX + "px";
    this.element.style.top = this.posY + this.desfaseY + "px";
  }
}
