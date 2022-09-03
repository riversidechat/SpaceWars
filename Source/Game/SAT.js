class Polygon {
    constructor(position, rotation, model) {
        this.position = position;
        this.rotation = rotation;
        this.model = model;
        this.translated = [];
        this.update();
    }
    draw() {
        for(let i = 0; i < this.translated.length; ++i) {
            let i2 = (i + 1) % this.translated.length;

            let p1 = this.translated[i];
            let p2 = this.translated[i2];

            renderer.line(p1, p2);
        }
    }
    translate(v) {
        return vec2.rotate(v, this.rotation).add(this.position);
    }
    update() {
        for(let i = 0; i < this.model.length; ++i) {
            let p = this.translate(this.model[i]);
            this.translated[i] = p;
        }
    }
    add(point) {
        this.model.push(point);
    }
    get area() {
        let min_x = Infinity;
        let min_y = Infinity;
        let max_x = -Infinity;
        let max_y = -Infinity;

        for(let p of this.translated) {
            if(p.x > max_x) max_x = p.x;
            if(p.x < min_x) min_x = p.x;

            if(p.y > max_y) max_y = p.y;
            if(p.y < min_y) min_y = p.y;
        }

        return new rect(min_x, min_y, max_x - min_x, max_y - min_y);
    }
}
function SAT(a, b) {
    for(let polygon of [a, b]) {
        for(let i = 0; i < polygon.translated.length; ++i) {
            let i2 = (i + 1) % polygon.translated.length;
            let p1 = polygon.translated[i];
            let p2 = polygon.translated[i2];

            let normal = vec2.create(p2.y - p1.y, p1.x - p2.x);

            let minA = Infinity;
            let maxA = -Infinity;
            for(let p of a.translated) {
                let projected = normal.x * p.x + normal.y * p.y;
                minA = Math.min(projected, minA);
                maxA = Math.max(projected, maxA);
            }

            let minB = Infinity;
            let maxB = -Infinity;
            for(let p of b.translated) {
                let projected = normal.x * p.x + normal.y * p.y;
                minB = Math.min(projected, minB);
                maxB = Math.max(projected, maxB);
            }
         
            if (maxA < minB || maxB < minA)
                return false;
        }
    }
    return true;
}
function SAT_static(a, b) {
    let overlap = Infinity;
    for(let polygon of [a, b]) {
        for (let i = 0; i < polygon.translated.length; i++)
        {
            let i2 = (i + 1) % polygon.translated.length;
            let p1 = polygon.translated[i];
            let p2 = polygon.translated[i2];
            let normal = vec2.create(-(p2.y - p1.y), p2.x - p1.x).normalize();
            
            let minA = Infinity, maxA = -Infinity;
            for (let p of a.translated)
            {
                let q = (p.x * normal.x + p.y * normal.y);
                minA = Math.min(minA, q);
                maxA = Math.max(maxA, q);
            }

            let minB = Infinity, maxB = -Infinity;
            for(let p of b.translated)
            {
                let q = (p.x * normal.x + p.y * normal.y);
                minB = Math.min(minB, q);
                maxB = Math.max(maxB, q);
            }

            overlap = Math.min(Math.min(maxA, maxB) - Math.max(minA, minB), overlap);

            if (!(maxB >= minA && maxA >= minB))
                return false;
        }
    }
    let d = vec2.subtract(b.position, a.position);
    let s = d.magnitude();
    a.position.subtract(vec2.multiply(d, overlap / 2).divide(s));
    b.position.add(vec2.multiply(d, overlap / 2).divide(s));

    return true;
}