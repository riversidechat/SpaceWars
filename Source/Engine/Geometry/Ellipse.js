class ellipse {
  constructor(a, b, c, d) {
    if(a == undefined) {
      this.x = 0;
      this.y = 0;
      this.xradius = 0;
      this.yradius = 0;
    }
    else if(b == undefined) {
      if(typeof a != 'object')
      throw "Error: cannot create ellipse with only 1 arg";

      this.x = a.x;
      this.y = a.y;
      this.xradius = a.xradius;
      this.yradius = a.yradius;
    } else if(c == undefined) {
      this.x = a.x;
      this.y = a.y;
      this.xradius = b.x;
      this.yradius = b.y;
    } else {
      if(d == undefined)
        throw "Error: cannot create ellipse with only 3 arg";
      this.x = a;
      this.y = b;
      this.xradius = c;
      this.yradius = d;
    }
  }

  static create(a, b, c, d) {
    return new ellipse(a, b, c, d);
  }
  clone() {
    return new ellipse(this.x, this.y, this.xradius, this.yradius);
  }

  print() {
    console.log(`Ellipse [ x: ${this.x}, y: ${this.y}, xradius: ${this.xradius}, yradius: ${this.yradius} ]`);
    return this;
  }
  static print(a) {
    return a.print();
  }
}
