// ----------------------------------------------------------------------------CLASE P5 -> HTML
class Hueso {
  // ---------------------------------------------------------------CONSTRUCTOR
  constructor(_clases, _padre) {
    this.tamX = 0;
    this.tamY = 0;

    this.padre = _padre;

    // console.log(this);
    // // Si se le pide un id en vez de una clase
    // if (_clases.includes("#")) {
    //   console.log("incluye id");
    //   this.element = select(_clases);
    //   this.clases = this.element.class();
    // } else {
    //   console.log("NO incluye id");
    
    // Crearlo como p5.Element mantiene su posición relativa al scrollear el canvas
    // Se accede al div posta con .elt
    this.element = createDiv();

    // Vincular con el resto del HTML
    this.element.parent(this.padre.element);

    this.clases = _clases.split(" ");
    this.element.addClass(this.clases.join(" "));
    // }

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
  newContextoOption(_evento, _texto, _method) {
    this.contextOptions.push(new ContextOption(this, _evento, _texto));
    this.element.elt.addEventListener(_evento, _method.bind(this));
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

    this.element.elt.style.position = "fixed";
    this.element.position(this.posX, this.posY);
  }

  // ---------------------------------------------------------------CAMBIAR TAMAÑO DEL HTML
  actualizarPosTam(_cambiarPX, _cambiarPY, _cambiarTX, _cambiarTY) {
    // Guardar datos anteriores
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

    push();
    fill(360);
    ellipse(this.posX, this.posY, 10);
    pop();

    // Reubicar en función del nuevo tamaño
    this.element.position(
      pPosX + _cambiarPX - cambioX,
      pPosY + _cambiarPY - cambioY,
    );
  }
}
