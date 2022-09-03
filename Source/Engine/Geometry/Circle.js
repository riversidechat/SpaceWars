class circle {
  constructor(a, b, c) {
    if(a == undefined) {
      this.x = 0;
      this.y = 0;
      this.radius = 0;
    }
    else if(b == undefined) {
      if(typeof a != 'object')
      throw "Error: cannot create circle with only 1 arg";

      this.x = a.x;
      this.y = a.y;
      this.radius = a.radius;
    } else if(c == undefined) {
      this.x = a.x;
      this.y = a.y;
      this.radius = b;
    } else {
      this.x = a;
      this.y = b;
      this.radius = c;
    }
  }

  get position() { return vec2.create(this.x, this.y); }
  set position(v) { this.x = v.x; this.y = v.y; }

  static create(a, b, c) {
    return new circle(a, b, c);
  }
  clone() {
    return new circle(this.x, this.y, this.radius);
  }

  contains(other) {
    let dist = math.distance(this.x, this.y, other.x, other.y);
    return this.radius >= (dist + other.radius);
  }
  overlaps(other) {
    let dist = math.distance(this.x, this.y, other.x, other.y);
    return dist <= (this.radius + other.radius);
  }
  
  static contains(a, b) {
    return a.contains(b);
  }
  static overlaps(a, b) {
    return a.overlaps(b);
  }

  print() {
    console.log(`Circle [ x: ${this.x}, y: ${this.y}, radius: ${this.radius} ]`);
    return this;
  }
  static print(a) {
    return a.print();
  }
}
