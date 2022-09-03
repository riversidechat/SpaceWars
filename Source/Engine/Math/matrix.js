class matrix {
    constructor(a, b) {
        if(a instanceof matrix) {
            this.rows = a.rows;
            this.cols = a.cols;

            this.data = new Array(a.rows);
            for(let i = 0; i < rows; ++i) {
                this.data[i] = [a.data[i]];
            }
        } else if(a instanceof Array && a[0] instanceof Array) {
            this.rows = a.length;
            this.cols = a[0].length;
    
            this.data = new Array(a.length);
            for(let i = 0; i < a.length; ++i) {
                if(!(a[i] instanceof Array) || this.cols != a[i].length) { console.error("Unconsistent array lengths while constructing matrix"); }

                this.data[i] = [...a[i]];
            }
        } else if(typeof a === 'number' && typeof b === 'number') {
            this.rows = a;
            this.cols = b;
    
            var zeros = Array.apply(null, Array(this.cols)).map(Number.prototype.valueOf, 0);
            this.data = Array.apply(null, Array(this.rows)).map(() => { return zeros.slice(); });
        } else {
            console.error("Unknown type passed into matrix constructor");
        }
    }

    static create(a, b) {
        return new matrix(a, b);
    }
    clone() {
        let result = new matrix(this.rows, this.cols);
        result.forEach((value, i, j) => { return this.data[i][j]; });
        return result;
    }
    forEach(f) {
        for(let i = 0; i < this.rows; ++i) {
            for(let j = 0; j < this.cols; ++j) {
                this.data[i][j] = f(this.data[i][j], i, j);
            }
        }
        return this;
    }
    static map(m, f) {
        let result = new matrix(m.rows, m.cols);
        for(let i = 0; i < m.rows; ++i) {
            for(let j = 0; j < m.cols; ++j) {
                result.data[i][j] = f(m.data[i][j], i, j);
            }
        }
        return result;
    }

    toArray() {
        let result = new Array(this.rows * this.cols);
        for(let i = 0; i < this.rows; ++i) {
            for(let j = 0; j < this.cols; ++j) {
                result[j + (i * this.cols)] = this.data[i][j];
            }
        }
        return result;
    }
    static fromArray(arr) {
        let result = new matrix(arr.length, 1);
        for(let i = 0; i < arr.length; ++i) {
            result.data[i][0] = arr[i];
        }
        return result;
    }
    toVec() {
        let result = new vec(this.rows * this.cols);
        for(let i = 0; i < this.rows; ++i) {
            for(let j = 0; j < this.cols; ++j) {
                result.set(j + (i * this.cols), this.data[i][j]);
            }
        }
        return result;
    }
    static fromVec(arr) {
        let result = new matrix(arr.length, 1);
        for(let i = 0; i < arr.length; ++i) {
            result.data[i][0] = arr.get(i);
        }
        return result;
    }

    get(i, j) {
        return this.data[i][j];
    }
    set(i, j, value) {
        this.data[i][j] = value;
    }

    add(a) {
        if(a instanceof matrix) {
            if(a.rows != this.rows) { console.error("Matrix must have equal rows"); return; }
            if(a.cols != this.cols) { console.error("Matrix must have equal cols"); return; }

            this.forEach((value, i, j) => { return value + a.data[i][j]; });
        } else  {
            this.forEach((value) => { return value + a; });
        }

        return this;
    }
    subtract(a) {
        if(a instanceof matrix) {
            if(a.rows != this.rows) { console.error("Matrix must have equal rows"); return; }
            if(a.cols != this.cols) { console.error("Matrix must have equal cols"); return; }

            this.forEach((value, i, j) => { return value - a.data[i][j]; });
        } else  {
            this.forEach((value) => { return value - a; });
        }

        return this;
    }
    multiply(a) {
        if(a instanceof matrix) {
            if(a.rows != this.rows) { console.error("Matrix must have equal rows"); return; }
            if(a.cols != this.cols) { console.error("Matrix must have equal cols"); return; }

            this.forEach((value, i, j) => { return value * a.data[i][j]; });
        } else  {
            this.forEach((value) => { return value * a; });
        }

        return this;
    }
    divide(a) {
        if(a instanceof matrix) {
            if(a.rows != this.rows) { console.error("Matrix must have equal rows"); return; }
            if(a.cols != this.cols) { console.error("Matrix must have equal cols"); return; }

            this.forEach((value, i, j) => { return value / a.data[i][j]; });
        } else  {
            this.forEach((value) => { return value / a; });
        }

        return this;
    }

    static add(a, b) {
        if(!(a instanceof matrix) && !(b instanceof matrix)) { console.error("At least one peram must be a matrix"); return; }

        let result;

        if(a instanceof matrix && b instanceof matrix) {
            if(a.rows != b.rows) { console.error("Matrix must have equal rows"); return; }
            if(a.cols != b.cols) { console.error("Matrix must have equal cols"); return; }

            result = new matrix(a.rows, a.cols);

            result.forEach((value, i, j) => { return a.data[i][j] + b.data[i][j]; });
        } else if(a instanceof matrix && typeof b === 'number') {
            result = new matrix(a.rows, a.cols);
            result.forEach((value, i, j) => { return a.data[i][j] + b; });
        } else if(b instanceof matrix && typeof a === 'number') {
            result = new matrix(b.rows, b.cols);           
            result.forEach((value, i, j) => { return a + b.data[i][j]; });
        }

        return result;
    }
    static subtract(a, b) {
        if(!(a instanceof matrix) && !(b instanceof matrix)) { console.error("At least one peram must be a matrix"); return; }

        let result;

        if(a instanceof matrix && b instanceof matrix) {
            if(a.rows != b.rows) { console.error("Matrix must have equal rows"); return; }
            if(a.cols != b.cols) { console.error("Matrix must have equal cols"); return; }

            result = new matrix(a.rows, a.cols);

            result.forEach((value, i, j) => { return a.data[i][j] - b.data[i][j]; });
        } else if(a instanceof matrix && typeof b === 'number') {
            result = new matrix(a.rows, a.cols);
            result.forEach((value, i, j) => { return a.data[i][j] - b; });
        } else if(b instanceof matrix && typeof a === 'number') {
            result = new matrix(b.rows, b.cols);           
            result.forEach((value, i, j) => { return a - b.data[i][j]; });
        }

        return result;
    }
    static multiply(a, b) {
        if(!(a instanceof matrix) && !(b instanceof matrix)) { console.error("At least one peram must be a matrix"); return; }

        let result;

        if(a instanceof matrix && b instanceof matrix) {
            if(a.rows != b.rows) { console.error("Matrix must have equal rows"); return; }
            if(a.cols != b.cols) { console.error("Matrix must have equal cols"); return; }

            result = new matrix(a.rows, a.cols);

            result.forEach((value, i, j) => { return a.data[i][j] * b.data[i][j]; });
        } else if(a instanceof matrix && typeof b === 'number') {
            result = new matrix(a.rows, a.cols);
            result.forEach((value, i, j) => { return a.data[i][j] * b; });
        } else if(b instanceof matrix && typeof a === 'number') {
            result = new matrix(b.rows, b.cols);           
            result.forEach((value, i, j) => { return a * b.data[i][j]; });
        }

        return result;
    }
    static divide(a, b) {
        if(!(a instanceof matrix) && !(b instanceof matrix)) { console.error("At least one peram must be a matrix"); return; }

        let result;

        if(a instanceof matrix && b instanceof matrix) {
            if(a.rows != b.rows) { console.error("Matrix must have equal rows"); return; }
            if(a.cols != b.cols) { console.error("Matrix must have equal cols"); return; }

            result = new matrix(a.rows, a.cols);

            result.forEach((value, i, j) => { return a.data[i][j] / b.data[i][j]; });
        } else if(a instanceof matrix && typeof b === 'number') {
            result = new matrix(a.rows, a.cols);
            result.forEach((value, i, j) => { return a.data[i][j] / b; });
        } else if(b instanceof matrix && typeof a === 'number') {
            result = new matrix(b.rows, b.cols);           
            result.forEach((value, i, j) => { return a / b.data[i][j]; });
        }

        return result;
    }

    static dot(a, b) {
        let result;

        if(b instanceof matrix) {
            if (a.cols != b.rows) { console.error("Matrix A cols must match matrix B rows"); return; }
            result = new matrix(a.rows, b.cols);
            
            for(let i = 0; i < a.rows; ++i) {
                for(let j = 0; j < b.cols; ++j) {
                    let sum = 0;
                    for(let k = 0; k < a.cols; ++k) {
                        sum += a.data[i][k] * b.data[k][j];
                    }
                    result.data[i][j] = sum;
                }
            }
        } else if(b instanceof vec) {
            if (a.cols != b.length) { console.error("Matrix A cols must match vector B length"); return; }
            result = new vec(a.rows)

            for(let i = 0; i < a.rows; ++i) {
                let sum = 0;
                for(let j = 0; j < a.cols; ++j) {
                    sum += a.data[i][j] * b.data[j];
                }
                result.data[i] = sum;
            }
        }

        return result;
    }
    transpose() {
        let result = new matrix(this.cols, this.rows);
        result.forEach((value, i, j) => { return this.data[j][i]; });
        return result;
    }
    randomize(min = -1, max = 1) {
        this.forEach(() => { return math.random(min, max);});
    }
}