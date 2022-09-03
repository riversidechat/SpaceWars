class rect {
  constructor(a, b, c, d) {
    if(a == undefined) {
      this.x = 0;
      this.y = 0;
      this.w = 0;
      this.h = 0;
    }
    else if(b == undefined) {
      if(typeof a != 'object')
        throw "Error: cannot create rect with only 1 arg";

      this.x = a.x;
      this.y = a.y;
      this.w = a.w;
      this.h = a.h;
    } else {
      if(c == undefined) {
        if(typeof a != 'object' || typeof b != 'object')
          throw "Error: cannot create rect with only 2 args";

        this.x = a.x;
        this.y = a.y;
        this.w = b.x;
        this.h = b.y;
      } else {
        if(d == undefined)
          throw "Error: cannot create rect with only 3 args";          
        this.x = a;
        this.y = b;
        this.w = c;
        this.h = d;
      }
    }
  }

  static create(a, b, c, d) {
    return new rect(a, b, c, d);
  }
  clone() {
    return new rect(this.x, this.y, this.w, this.h);
  }

  get position() { return new vec2(this.x, this.y); }
  get size() { return new vec2(this.w, this.h); }
  get top() { return this.y; }
  get bottom() { return this.y + this.h; }
  get left() { return this.x; }
  get right() { return this.x + this.w; }
  get center() { return new vec2(this.x + (this.w / 2), this.y + (this.h / 2)); }

  set position(vec) { this.x = vec.x; this.y = vec.y }
  set size(vec) { this.w = vec.x; this.h = vec.y }
  set top(value) { this.y = value; }
  set bottom(value) { this.y = (value - this.h); }
  set left(value) { this.x = value; }
  set right(value) { this.x = (value - this.w); }
  set center(vec) { this.x = (vec.x - (this.w / 2)); this.y = (vec.y - (this.h / 2)); }

  contains(other) {
    if(other instanceof vec2) {
      return ((this.left <= other.x) &&
            (this.top <= other.y) &&
            (this.right >= other.x) &&
            (this.bottom >= other.y));
    }
    return ((other.left >= this.left) &&
            (other.top >= this.top) &&
            (other.right <= this.right) &&
            (other.bottom <= this.bottom));
  }
  overlaps(other) {
    return ((this.left <= other.right) &&
            (this.top <= other.bottom) &&
            (this.right >= other.left) &&
            (this.bottom >= other.top));
  }
  
  static contains(a, b) {
    return a.contains(b);
  }
  static overlaps(a, b) {
    return a.overlaps(b);
  }

  print() {
    console.log(`Rect [ x: ${this.x}, y: ${this.y}, w: ${this.w}, h: ${this.h} ]`);
    return this;
  }
  static print(a) {
    return a.print();
  }
}

class rotated_rect {
  constructor(a, b, c, d, e) {
    if(a == undefined) {
      this.x = 0;
      this.y = 0;
      this.w = 0;
      this.h = 0;
      this.rotation = 0;
    }
    else if(b == undefined) {
      if(typeof a != 'object')
        throw "Error: cannot create SATrect with only 1 arg";

      this.x = a.x;
      this.y = a.y;
      this.w = a.w;
      this.h = a.h;
      this.rotation = a.rotation;
    } else {
      if(c == undefined) {
          throw "Error: cannot create SATrect with only 2 args";
      } else if(d == undefined) {
        if(typeof a != 'object' || typeof b != 'object')
            throw "Error: cannot create SATrect with only 3 arguments without the first two being a vector";
        this.x = a.x;
        this.y = a.y;
        this.w = b.x;
        this.h = b.y;
        this.rotation = c;
      } else {
        if(e == undefined)
          throw "Error: cannot create rect with only 4 args";          
        this.x = a;
        this.y = b;
        this.w = c;
        this.h = d;
        this.rotation = e;
      }
    }
  }

  static create(a, b, c, d, e) {
    return new rotated_rect(a, b, c, d, e);
  }
  clone() {
    return new rotated_rect(this.x, this.y, this.w, this.h, this.rotation);
  }

  get position() { return new vec2(this.x - this.w / 2, this.y - this.h / 2); }
  get size() { return new vec2(this.w, this.h); }
  get top() { return this.y - this.h / 2; }
  get bottom() { return this.y + this.h / 2; }
  get left() { return this.x - this.w / 2; }
  get right() { return this.x + this.w / 2; }
  get center() { return new vec2(this.x, this.y); }

  set position(vec) { this.x = (vec.x + (this.w / 2)); this.y = (vec.y + (this.h / 2)) }
  set size(vec) { this.w = vec.x; this.h = vec.y }
  set top(value) { this.y = value + (this.h / 2); }
  set bottom(value) { this.y = value - (this.h / 2); }
  set left(value) { this.x = value + (this.w / 2); }
  set right(value) { this.x = value - (this.w / 2); }
  set center(vec) { this.x = vec.x; this.y = vec.y; }

  contains_point(p) {
    let rotate = (v) => { return vec2.subtract(v, this.center).rotate(-this.rotation).add(this.center); }
    let rotated_point = rotate(p.clone());

    return (rotated_point.x >= this.left && rotated_point.x <= this.right && rotated_point.y >= this.top && rotated_point.y <= this.bottom);
  }
  draw() {
    let translate = (v) => { return vec2.subtract(v, this.center).rotate(this.rotation).add(this.center); }

    renderer.line(new line(translate(this.position), translate(vec2.create(this.right, this.top))));
    renderer.line(new line(translate(vec2.create(this.right, this.top)), translate(this.position.add(this.size))));
    renderer.line(new line(translate(this.position.add(this.size)), translate(vec2.create(this.left, this.bottom))));
    renderer.line(new line(translate(vec2.create(this.left, this.bottom)), translate(this.position)));
  }
}