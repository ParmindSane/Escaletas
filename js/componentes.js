// ----------------------------------------------------------------------------CLASE P5 -> HTML
class Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_clases, _padre) {
    this.tamX = 0;
    this.tamY = 0;

    this.padre = _padre;

    // Si se le pide un id en vez de una clase, busca un elemento que ya exista en el HTML
    if (_clases.includes("#")) {
      this.element = select(_clases);
      this.clases = this.element.class();
    } else {
      // Crearlo como p5.Element facilita algunas funciones en relación al Canvas
      // Se accede al div posta con .elt
      this.element = createDiv();

      // Vincular con el resto del HTML
      this.element.parent(this.padre.element);

      this.clases = _clases.split(" ");
      this.element.addClass(this.clases.join(" "));
    }

    // Referencia al Hueso en el Elemento
    this.element.elt.hueso = this;

    // Guardar tamaño asignado por CSS a la clase. Si no tiene, es 0
    if (this.element.size().height !== 0) {
      this.tamX = this.element.size().width;
      this.tamY = this.element.size().height;
    }

    // Deja preparado un array para las opciones de menú contextual
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
}

// ----------------------------------------------------------------------------CLASE P5 -> HTML CON POSICIÓN DEFINIDA
class HuesoFlotante extends Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_x, _y, _clase, _padre) {
    super(_clase, _padre);

    this.posX = _x;
    this.posY = _y;

    push();
    ellipse(this.posX, this.posY, 10);
    pop();

    // this.element.elt.style.position = "fixed";
    this.element.position(this.posX, this.posY);
  }

  // ---------------------------------------------------------------CAMBIAR POSICIÓN DEL HUESO
  mover(_mx, _my) {
    this.actualizarPosTam(_mx, _my, 0, 0);

    this.posX += _mx;
    this.posY += _my;
  }

  // ---------------------------------------------------------------CAMBIAR TAMAÑO DEL HTML
  actualizarPosTam(_cambiarPX, _cambiarPY, _cambiarTX, _cambiarTY) {
    // Guardar datos anteriores de tamaño
    let pPosX = this.element.position().x;
    let pPosY = this.element.position().y;
    let pTamX = this.tamX;
    let pTamY = this.tamY;

    // Leer nuevo tamaño
    this.tamX = this.element.size().width;
    this.tamY = this.element.size().height;

    // Calcular cambio de tamaño
    let cambioX = (this.tamX - pTamX) / 2;
    let cambioY = (this.tamY - pTamY) / 2;

    /* Según los parámetros, el cambio puede ser:
        -(Number): El número especificado por parámetro
        -(false): La diferencia entre antes y después, calculada automáticamente
    */
    if (_cambiarTX) {
      cambioX = _cambiarTX;
    }
    if (_cambiarTY) {
      cambioY = _cambiarTY;
    }

    // Reubicar en función del nuevo tamaño
    this.element.position(
      pPosX + _cambiarPX - cambioX,
      pPosY + _cambiarPY - cambioY,
    );
  }
}
