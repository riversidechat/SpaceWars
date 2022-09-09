class line {
    constructor(a, b, c, d) {
        if (a == undefined) {
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;
        }
        else if (b == undefined) {
            if (typeof a != 'object')
                throw "Error: cannot create line with only 1 arg";

            this.x1 = a.x1;
            this.y1 = a.y1;
            this.x2 = a.x2;
            this.y2 = a.y2;
        } else {
            if (c == undefined) {
                if (typeof a != 'object' || typeof b != 'object')
                    throw "Error: cannot create line with only 2 args";

                this.x1 = a.x;
                this.y1 = a.y;
                this.x2 = b.x;
                this.y2 = b.y;
            } else {
                if (d == undefined)
                    throw "Error: cannot create line with only 3 args";
                this.x1 = a;
                this.y1 = b;
                this.x2 = c;
                this.y2 = d;
            }
        }
    }

    static create(a, b, c, d) {
        return new line(a, b, c, d);
    }
    clone() {
        return new line(this.x1, this.y1, this.x2, this.y2);
    }

    get a() { return new vec2(this.x1, this.y1); }
    get b() { return new vec2(this.x2, this.y2); }
    get start() { return new vec2(this.x1, this.y1); }
    get end() { return new vec2(this.x2, this.y2); }
    get center() { return new vec2(math.lerp(this.x1, this.x2, 0.5), math.lerp(this.y1, this.y2, 0.5)); }

    set a(vec) { this.x1 = vec.x; this.y1 = vec.y }
    set b(vec) { this.x2 = vec.x; this.y2 = vec.y }
    set start(vec) { this.x1 = vec.x; this.y1 = vec.y }
    set end(vec) { this.x2 = vec.x; this.y2 = vec.y }
    set center(vec) { let temp = this.center; this.start = (vec2.add(vec, vec2.subtract(this.start, this.center))); this.end = (vec2.add(vec, vec2.subtract(this.end, temp))) }

    lerp(tx, ty = tx) {
        return vec2.create(math.lerp(this.x1, this.x2, tx), math.lerp(this.y1, this.y2, ty));
    }
    static lerp(l, tx, ty) {
        let result = new line(l);
        return result.lerp(tx, ty);
    }

    print() {
        console.log(`Line [ A [ x: ${this.x1}, y: ${this.y1} ], B [ x: ${this.x2}, y: ${this.y2} ] ]`);
        return this;
    }
    static print(a) {
        return a.print();
    }

    get area() {
        let x1 = Math.min(this.x1, this.x2)
        let y1 = Math.min(this.y1, this.y2)
        let x2 = Math.max(this.x1, this.x2)
        let y2 = Math.max(this.y1, this.y2)
        return new rect(x1, y1, x2 - x1, y2 - y1);
    }
}

class thick_line {
    constructor(a, b, c, d, e) {
        if(a == undefined) {
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;
            this.thickness = 0;
        } else if(b == undefined) {
            if(!(a instanceof thick_line))
                throw new TypeError("Cannont construct a new \"thick_line\" with only one argument that is not a instance of \"thick_line\"");

            this.x1 = a.x1;
            this.y1 = a.y1;
            this.x2 = a.x2;
            this.y2 = a.y2;
            this.thickness = a.thickness;
        } else if(c == undefined) {
            if(!((a instanceof vec2) && (b instanceof vec2)))
                throw new TypeError("Cannont construct a new \"thick_line\" with only two arguments that are not a instance of \"vec2\"");

            this.x1 = a.x;
            this.y1 = a.y;
            this.x2 = b.x;
            this.y2 = b.y;
            this.thickness = 0;
        } else if(d == undefined) {
            if(!((a instanceof vec2) && (b instanceof vec2)))
                throw new TypeError("Cannont construct a new \"thick_line\" with only three arguments, where the first two arguments are not a instance of \"vec2\"");

            this.x1 = a.x;
            this.y1 = a.y;
            this.x2 = b.x;
            this.y2 = b.y;
            this.thickness = c;
        } else if(e == undefined) {
            this.x1 = a;
            this.y1 = b;
            this.x2 = c
            this.y2 = d;
            this.thickness = 0;
        } else {
            this.x1 = a;
            this.y1 = b;
            this.x2 = c
            this.y2 = d;
            this.thickness = e;
        }
    }

    static create(a, b, c, d, e) {
        return new thick_line(a, b, c, d, e);
    }
    clone() {
        return new thick_line(this.x1, this.y1, this.x2, this.y2, this.thickness);
    }

    get a() { return new vec2(this.x1, this.y1); }
    get b() { return new vec2(this.x2, this.y2); }
    get start() { return new vec2(this.x1, this.y1); }
    get end() { return new vec2(this.x2, this.y2); }
    get center() { return new vec2(math.lerp(this.x1, this.x2, 0.5), math.lerp(this.y1, this.y2, 0.5)); }

    set a(vec) { this.x1 = vec.x; this.y1 = vec.y }
    set b(vec) { this.x2 = vec.x; this.y2 = vec.y }
    set start(vec) { this.x1 = vec.x; this.y1 = vec.y }
    set end(vec) { this.x2 = vec.x; this.y2 = vec.y }
    set center(vec) { let temp = this.center; this.start = (vec2.add(vec, vec2.subtract(this.start, this.center))); this.end = (vec2.add(vec, vec2.subtract(this.end, temp))) }

    lerp(tx, ty = tx) {
        return vec2.create(math.lerp(this.x1, this.x2, tx), math.lerp(this.y1, this.y2, ty));
    }
    static lerp(l, tx, ty) {
        let result = new thick_line(l);
        return result.lerp(tx, ty);
    }

    print() {
        console.log(`Thick Line [ A [ x: ${this.x1}, y: ${this.y1} ], B [ x: ${this.x2}, y: ${this.y2} ], Thickness: ${this.thickness} ]`);
        return this;
    }
    static print(a) {
        return a.print();
    }
}