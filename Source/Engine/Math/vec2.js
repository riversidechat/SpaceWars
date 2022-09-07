class vec2 {
  constructor(a, b) {
    if(a == undefined) {
      this.x = this.y = 0;
    } else if(b == undefined) {
      if(typeof a == 'object') {
        this.x = a.x;
        this.y = a.y;
      } else {
        this.x = this.y = a;
      }
    } else {
      this.x = a;
      this.y = b;
    }
  }
  static create(a, b) {
    return new vec2(a, b);
  }

  clone() {
    return new vec2(this.x, this.y);
  }

  add(a, b) {
    if(typeof a == 'object') {
      this.x += a.x;
      this.y += a.y;
    } else {
      if(b == undefined) {
        this.x += a;
        this.y += a;
      } else {
        this.x += a;
        this.y += b;
      }
    }

    return this;
  }
  subtract(a, b) {
    if(typeof a == 'object') {
      this.x -= a.x;
      this.y -= a.y;
    } else {
      if(b == undefined) {
        this.x -= a;
        this.y -= a;
      } else {
        this.x -= a;
        this.y -= b;
      }
    }
    
    return this;
  }
  multiply(a, b) {
    if(typeof a == 'object') {
      this.x *= a.x;
      this.y *= a.y;
    } else {
      if(b == undefined) {
        this.x *= a;
        this.y *= a;
      } else {
        this.x *= a;
        this.y *= b;
      }
    }
    
    return this;
  }
  divide(a, b) {
    if(typeof a == 'object') {
      this.x /= a.x;
      this.y /= a.y;
    } else {
      if(b == undefined) {
        this.x /= a;
        this.y /= a;
      } else {
        this.x /= a;
        this.y /= b;
      }
    }
    
    return this;
  }

  static add(a, b, c) {
    let r = new vec2(a);
    return r.add(b, c);
  }
  static subtract(a, b, c) {
    let r = new vec2(a);
    return r.subtract(b, c);
  }
  static multiply(a, b, c) {
    let r = new vec2(a);
    return r.multiply(b, c);
  }
  static divide(a, b, c) {
    let r = new vec2(a);
    return r.divide(b, c);
  }

  equals(v) {
    if(typeof v == 'object')
      return (this.x == v.x) && (this.y == v.y);
    else
      return (this.x == v) && (this.y == v);
  }
  static equals(v1, v2) {
    return v1.equals(v2);
  }

  magnitude() {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }
  normalize() {
    if(this.x == 0 && this.y == 0) return this;
    let mag = this.magnitude();
    this.x /= mag;
    this.y /= mag;
    return this;
  }
  dot(a) {
    return (this.x * a.x) + (this.y * a.y);
  }
  negative() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  rotate(theta) {
    let temp = this.x;
    this.x = this.x * Math.cos(theta) - this.y * Math.sin(theta);
    this.y = temp * Math.sin(theta) + this.y * Math.cos(theta);
    return this;
  }
  randomize(min_x, max_x, min_y, max_y) {
    this.x = math.random(min_x, max_x);
    this.y = math.random(min_y ||min_x, max_y || max_x);
    return this;
  }
  lerp(v, tx, ty) {
    this.x = math.lerp(this.x, v.x, tx);
    this.y = math.lerp(this.y, v.y, ty || tx);
    return this;
  }
  lerpf(f, v, tx, ty) {
    this.x = f(this.x, v.x, tx);
    this.y = f(this.y, v.y, ty || tx);
    return this;
  }
  rotation() {
    return Math.atan2(this.y, this.x);
  }

  static magnitude(a) {
    let r = new vec2(a);
    return r.magnitude();
  }
  static normalize(a) {
    let r = new vec2(a);
    return r.normalize();
  }
  static dot(a, b) {
    let r = new vec2(a);
    return r.dot(b);
  }
  static negative(a) {
    let r = new vec2(a);
    return r.negative();
  }
  static rotate(v, theta) {
    let r = new vec2(v);
    return r.rotate(theta);
  }
  static randomize(v, min_x, max_x, min_y, max_y) {
    let r = new vec2(v);
    return r.randomize(min_x, max_x, min_y, max_y);
  }
  static random(min_x, max_x, min_y, max_y) {
    return vec2.zero.randomize(min_x, max_x, min_y, max_y);
  }
  static lerp(a, b, tx, ty) {
    let r = new vec2(a);
    return r.lerp(b, tx, ty);
  }
  static lerpf(f, a, b, tx, ty) {
    let r = new vec2(a);
    return r.lerpf(f, b, tx, ty);
  }
  static rotation(a) {
    let r = new vec2(a);
    return r.rotation();
  }

  distance(a) {
    let dx = a.x - this.x;
    let dy = a.y - this.y;
    return Math.sqrt((dx * dx) + (dy * dy));
  }
  static distance(a, b) {
    return a.distance(b);
  }

  zero() {
    this.x = 0;
    this.y = 0;
  }
  static get zero() {
    return new vec2(0, 0);
  }

  print() {
    console.log(`Vector2D [ x: ${this.x}, y: ${this.y} ]`);
    return this;
  }
  static print(a) {
    return a.print();
  }
  toVec() {
    return new vec([this.x, this.y]);
  }
}