// ----------------------------------------------------------------------------CLASE P5 -> HTML
class Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_element, _clases, _padre) {
    // Crearlo como p5.Element facilita algunas funciones en relación al Canvas
    // (se accede al elemento posta con .elt)
    this.element = _element;
    this.padre = _padre;

    // Si crea un elemento nuevo, le aplica los otros parámetros
    if (_clases && _padre) {
      this.element.parent(this.padre.element);
      this.element.addClass(_clases);
    } else {
      // Si usa un elemento que ya existe, toma sus datos
      if (this.element.parent().hueso) {
        this.padre = this.element.parent().hueso;
      }
    }

    // Referencia al Hueso en el Elemento
    // (para cuando se lo accede desde un evento)
    this.element.elt.hueso = this;

    // Guardar tamaño asignado por CSS a la clase. Por defecto es 0
    this.actualizarTam();

    // Dejar preparado un array para las opciones de menú contextual
    this.contextOptions = [];
  }

  // ---------------------------------------------------------------CREAR NUEVA OPCIÓN DE MENÚ CONTEXTUAL
  newContextOption(_evento, _texto, _method) {
    this.contextOptions.push(new ContextOption(this, _evento, _texto));

    // Si se especificó un método, se añade un EventListener local que lo ejecute
    if (_method) {
      this.element.elt.addEventListener(_evento, _method.bind(this));
    }
  }

  // ---------------------------------------------------------------DETECTAR SI EL EVENTO SE DISPARÓ DENTRO DEL OBJETO
  contieneTarget(_e) {
    let t = _e.target;
    return this.element.elt.contains(t) || this.element.elt === t;
  }

  // ---------------------------------------------------------------ACTUALIZAR TAMAÑO DEL ELEMENTO
  actualizarTam() {
    // Guardar acceso rápido al tamaño actual del elemento
    this.tamX = this.element.size().width;
    this.tamY = this.element.size().height;

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

    this.moverA(0, 0);
  }

  // ---------------------------------------------------------------CAMBIAR POSICIÓN DEL HUESO
  moverA(_x, _y) {
    // Guardar posición anterior
    this.pPosX = this.posX;
    this.pPosY = this.posY;

    // Si tiene un padre definido, toma de referencia a su Hueso para las coordenadas
    // (por defecto toma el 0;0 del lemento, que no tiene por qué ser el mismo)
    let refeX = 0;
    let refeY = 0;
    if (this.padre) {
      if (this.padre.desfaseX) {        
        refeX = -this.padre.desfaseX;
        refeY = -this.padre.desfaseY;
      }
    }

    // Si no se da un parámetro, se queda donde estaba
    // (para no tener que escribir hueso.pos cada vez)
    if (_x) {
      this.posX = refeX + _x;
    }
    if (_y) {
      this.posY = refeY + _y;
    }

    // Actualiza la ubicación del elemento manteniendo su posición relativa al Hueso
    this.desfasar(false, false);
  }

  // ---------------------------------------------------------------CAMBIAR POSICIÓN DEL HTML RESPECTO AL HUESO
  desfasar(_x, _y) {
    // Si no se da un parámetro de desfase, se queda como estaba
    // (para no tener que escribir hueso.desfase cada vez)
    if (_x) {
      this.desfaseX = _x;
    }
    if (_y) {
      this.desfaseY = _y;
    }

    // Mover el elemento sin afectar al Hueso
    this.element.position(this.posX + this.desfaseX, this.posY + this.desfaseY);
  }
}
