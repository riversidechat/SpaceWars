class vec {
    constructor(a) {
        if(a instanceof vec) {
            this.data = [...a.data];
        } else if(a instanceof Array) {
            this.data = [...a];   
        } else if(typeof a === 'number') {
            this.data = new Array(a).fill(0);
        } else {
            console.error("Unknown type passed into vec constructor");
        }

        this.length = this.data.length;
    }

    static create(a) {
        return new vec(a);
    }
    clone() {
        return new vec(this.data);
    }
    forEach(f) {
        for(let i = 0; i < this.length; ++i) {
            this.data[i] = f(this.data[i], i);
        }
    }
    static map(v, f) {
        let result = new vec(v);

        for(let i = 0; i < this.length; ++i) {
            result.data[i] = f(this.data[i], i);
        }

        return result;
    }

    toArray() {
        return [...this.data];
    }
    static fromArray(array) { 
        return new vec(array);
    }
    toVec2() {
        if(this.length < 2) { console.error("Vector must have a length of at least 2, to convert to a vec2"); return; }

        return new vec2(this.data[0], this.data[1]);
    }

    get(index) {
        return this.data[index];
    }
    set(index, value) {
        this.data[index] = value;
    }

    add(a) {
        if(a instanceof vec) {
            if(this.length != a.length ) { console.error(`Cannot add vectors with different lengths. Lengths: ${this.length}, ${a.length}`); return; }

            this.forEach((value, i) => { return value + a.data[i]; });
        } else if (typeof a === 'number') {
            this.forEach((value, i) => { return value + a; });
        }

        return this;
    }
    subtract(a) {
        if(a instanceof vec) {
            if(this.length != a.length ) { console.error(`Cannot subtract vectors with different lengths. Lengths: ${this.length}, ${a.length}`); return; }

            this.forEach((value, i) => { return value - a.data[i]; });
        } else if (typeof a === 'number') {
            this.forEach((value, i) => { return value - a; });
        }

        return this;
    }
    multiply(a) {
        if(a instanceof vec) {
            if(this.length != a.length ) { console.error(`Cannot multiply vectors with different lengths. Lengths: ${this.length}, ${a.length}`); return; }

            this.forEach((value, i) => { return value * a.data[i]; });
        } else if (typeof a === 'number') {
            this.forEach((value, i) => { return value * a; });
        }

        return this;
    }
    divide(a) {
        if(a instanceof vec) {
            if(this.length != a.length ) { console.error(`Cannot divide vectors with different lengths. Lengths: ${this.length}, ${a.length}`); return; }

            this.forEach((value, i) => { return value / a.data[i]; });
        } else if (typeof a === 'number') {
            this.forEach((value, i) => { return value / a; });
        }

        return this;
    }

    static add(a, b) {
        let result;
        if(a instanceof vec && b instanceof vec) {
            if(a.length != b.length ) { console.error(`Cannot add vectors with different lengths. Lengths: ${a.length}, ${b.length}`); return; }
            
            result = new vec(a.length);

            result.forEach((value, i) => { return a.data[i] + b.data[i]; });
        } else if (a instanceof vec && typeof b === 'number') {
            result = new vec(a.length);

            result.forEach((value, i) => { return a.data[i] + b; });
        }else if (typeof a === 'number' && b instanceof vec) {
            result = new vec(b.length);

            result.forEach((value, i) => { return a + b.data[i]; });
        }

        return result;
    }
    static subtract(a, b) {
        let result;
        if(a instanceof vec && b instanceof vec) {
            if(a.length != b.length ) { console.error(`Cannot subtract vectors with different lengths. Lengths: ${a.length}, ${b.length}`); return; }
            
            result = new vec(a.length);

            result.forEach((value, i) => { return a.data[i] - b.data[i]; });
        } else if (a instanceof vec && typeof b === 'number') {
            result = new vec(a.length);

            result.forEach((value, i) => { return a.data[i] - b; });
        }else if (typeof a === 'number' && b instanceof vec) {
            result = new vec(b.length);

            result.forEach((value, i) => { return a - b.data[i]; });
        }

        return result;
    }
    static multiply(a, b) {
        let result;
        if(a instanceof vec && b instanceof vec) {
            if(a.length != b.length ) { console.error(`Cannot multiply vectors with different lengths. Lengths: ${a.length}, ${b.length}`); return; }
            
            result = new vec(a.length);

            result.forEach((value, i) => { return a.data[i] * b.data[i]; });
        } else if (a instanceof vec && typeof b === 'number') {
            result = new vec(a.length);

            result.forEach((value, i) => { return a.data[i] * b; });
        }else if (typeof a === 'number' && b instanceof vec) {
            result = new vec(b.length);

            result.forEach((value, i) => { return a * b.data[i]; });
        }

        return result;
    }
    static divide(a, b) {
        let result;
        if(a instanceof vec && b instanceof vec) {
            if(a.length != b.length ) { console.error(`Cannot divide vectors with different lengths. Lengths: ${a.length}, ${b.length}`); return; }
            
            result = new vec(a.length);

            result.forEach((value, i) => { return a.data[i] / b.data[i]; });
        } else if (a instanceof vec && typeof b === 'number') {
            result = new vec(a.length);

            result.forEach((value, i) => { return a.data[i] / b; });
        }else if (typeof a === 'number' && b instanceof vec) {
            result = new vec(b.length);

            result.forEach((value, i) => { return a / b.data[i]; });
        }

        return result;
    }
}