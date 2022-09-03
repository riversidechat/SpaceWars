class canvas {
  static #count = 0;
  static #path = undefined;

  #area;

  constructor(a, b, c, area) {
    if(a == undefined)
      throw "Error: cannot create canvas with 0 args";

    if(b == undefined) {
      if(typeof a != 'object')
        throw "Error: cannot create canvas with only 1 arg";

      this.id = a.id;
      this.canvas = a.canvas;
      this.ctx = a.ctx;
    } else {
      if(c == undefined)
        throw "Error: cannot create canvas with only 2 args";
      
      this.id = a;
      this.canvas = b;
      this.ctx = c;
    }

    if(area == undefined)
      this.#area = new rect(0, 0, 0, 0);
    else 
      this.#area = area;

    this.canvas.style.position = 'absolute';
    this.updateCanvas();
  }
  static initialize(path = 'body') {
    canvas.#path = html.CreateElement('div', {id: 'AllCanvs'}, path)
  }
  static create(area) {
    if(canvas.#path == undefined)
      canvas.initialize();
    let id = html.CreateElement('canvas', {id: `canvas_${canvas.#count}`}, canvas.#path);
    let canv = document.querySelector(id);
    let ctx = canv.getContext('2d');

    ++canvas.#count;
    return new canvas(id, canv, ctx, area);
  }
  clone() {
    return canvas.create(this.#area);
  }

  getArea() {
    return this.#area;
  }
  SetArea(area) {
    this.#area = area;
    this.updateCanvas();
  }
  get position() {
    return this.#area.position;
  }
  get width() {
    return this.#area.w;
  }
  get height() {
    return this.#area.h;
  }
  set position(vec) {
    this.#area.position = position;
    this.updateCanvas();
  }
  set width(w) {
    this.#area.w = w;
    this.updateCanvas();
  }
  set height(h) {
    this.#area.h = h;
    this.updateCanvas();
  }
  updateCanvas() {
    this.canvas.style.left = this.#area.left + "px";
    this.canvas.style.top = this.#area.top + "px";
    this.canvas.width = this.#area.w;
    this.canvas.height = this.#area.h;
  }
}