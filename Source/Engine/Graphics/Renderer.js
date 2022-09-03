class renderer {
    static #canvs = [];
    static #count = 0;
    static #current = 0;

    static strokeWeight = 10;
    static strokeEnd = 'round';
    static strokeJoin = 'round';

    static fillColor = color.none;
    static strokeColor = color.none;
    static font = 'serif';
    static textAlign = 'center';
    static textBaseline = 'middle';
    static textDirection = 'inherit';
    static fontSize = 48;

    static camera = new camera(vec2.create(0, 0));
    static zoom = 1;

    static get canvas() {
        return renderer.#canvs[renderer.#current];
    }
    static set canvas(canv) {
        renderer.#canvs[renderer.#current] = canv;
    }

    static addCanvas(canv) {
        renderer.#canvs.push(canv);
        return renderer.#count++;
    }
    static createCanvas(area) {
        return renderer.addCanvas(canvas.create(area));
    }

    static get activeCanvas() {
        return renderer.#current;
    }
    static set activeCanvas(id) {
        renderer.#current = id;
    }

    static screenWidth() { return window.innerWidth; }
    static screenHeight() { return window.innerHeight; }

    static get width() {
        return renderer.canvas.width;
    }
    static set width(width) {
        return renderer.canvas.width = width;
    }
    static get height() {
        return renderer.canvas.height;
    }
    static set height(height) {
        return renderer.canvas.height = height;
    }
    static get size() { return vec2.create(renderer.width, renderer.height); }
    static set size(size) { renderer.width = size.x; renderer.height = size.y; }

    static get area() {
        return new rect(-renderer.width / 2 * renderer.zoom + renderer.camera.position.x,
                        -renderer.height / 2 * renderer.zoom + renderer.camera.position.y,
                        renderer.width * renderer.zoom,
                        renderer.height * renderer.zoom);
    }

    static #configCanvas(canvas) {
        canvas.ctx.fillStyle = renderer.fillColor.string();
        canvas.ctx.strokeStyle = renderer.strokeColor.string();

        canvas.ctx.lineWidth = renderer.strokeWeight / renderer.zoom;
        canvas.ctx.lineCap = renderer.strokeEnd;
        canvas.ctx.lineJoin = renderer.strokeJoin;
    }
    static #begin(canvas) {
        canvas.ctx.beginPath();
    }
    static #end(canvas) {
        canvas.ctx.closePath();
        canvas.ctx.stroke();
        canvas.ctx.fill();
    }

    static background(c) {
        let temp = renderer.fillColor;
        renderer.fillColor = c;

        let canvas = renderer.canvas;
        let area = new rect(0, 0, canvas.width, canvas.height);

        renderer.#configCanvas(canvas);
        renderer.#begin(canvas);

        canvas.ctx.moveTo(area.left, area.top);
        canvas.ctx.lineTo(area.right, area.top);
        canvas.ctx.lineTo(area.right, area.bottom);
        canvas.ctx.lineTo(area.left, area.bottom);

        renderer.#end(canvas);

        renderer.fillColor = temp;
        return renderer;
    }

    static rect(rect) {
        let canvas = renderer.canvas;
        renderer.#configCanvas(canvas);
        renderer.#begin(canvas);

        let translateX = (x) => { return math.map(x / renderer.zoom, -(renderer.width / 2), renderer.width / 2, 0, renderer.width); }
        let translateY = (y) => { return math.map(y / renderer.zoom, renderer.height / 2, -(renderer.height / 2), 0, renderer.height); }

        canvas.ctx.moveTo(translateX(rect.left - renderer.camera.position.x), translateY(rect.top - renderer.camera.position.y));
        canvas.ctx.lineTo(translateX(rect.right - renderer.camera.position.x), translateY(rect.top - renderer.camera.position.y));
        canvas.ctx.lineTo(translateX(rect.right - renderer.camera.position.x), translateY(rect.bottom - renderer.camera.position.y));
        canvas.ctx.lineTo(translateX(rect.left - renderer.camera.position.x), translateY(rect.bottom - renderer.camera.position.y));

        renderer.#end(canvas);
        return renderer;
    }
    static line(a, b) {
        let canvas = renderer.canvas;
        renderer.#configCanvas(canvas);
        renderer.#begin(canvas);
        let translateX = (x) => { return math.map(x / renderer.zoom, -(renderer.width / 2), renderer.width / 2, 0, renderer.width); }
        let translateY = (y) => { return math.map(y / renderer.zoom, renderer.height / 2, -(renderer.height / 2), 0, renderer.height); }

        if(b == undefined) {
            canvas.ctx.moveTo(translateX(a.x1 - renderer.camera.position.x), translateY(a.y1 - renderer.camera.position.y));
            canvas.ctx.lineTo(translateX(a.x2 - renderer.camera.position.x), translateY(a.y2 - renderer.camera.position.y));
        } else {
            canvas.ctx.moveTo(translateX(a.x - renderer.camera.position.x), translateY(a.y - renderer.camera.position.y));
            canvas.ctx.lineTo(translateX(b.x - renderer.camera.position.x), translateY(b.y - renderer.camera.position.y));
        }

        renderer.#end(canvas);
        return renderer;
    }
    static thick_line(l) {
        let temp = this.strokeWeight;
        renderer.strokeWeight = l.thickness;
        let canvas = renderer.canvas;
        renderer.#configCanvas(canvas);
        renderer.#begin(canvas);
        let translateX = (x) => { return math.map(x / renderer.zoom, -(renderer.width / 2), renderer.width / 2, 0, renderer.width); }
        let translateY = (y) => { return math.map(y / renderer.zoom, renderer.height / 2, -(renderer.height / 2), 0, renderer.height); }

        canvas.ctx.moveTo(translateX(l.x1 - renderer.camera.position.x), translateY(l.y1 - renderer.camera.position.y));
        canvas.ctx.lineTo(translateX(l.x2 - renderer.camera.position.x), translateY(l.y2 - renderer.camera.position.y));

        renderer.#end(canvas);
        renderer.strokeWeight = temp;
        return renderer;
    }
    static circle(circle) {
        let canvas = renderer.canvas;
        renderer.#configCanvas(canvas);
        renderer.#begin(canvas);

        let translateX = (x) => { return math.map(x / renderer.zoom, -(renderer.width / 2), renderer.width / 2, 0, renderer.width); }
        let translateY = (y) => { return math.map(y / renderer.zoom, renderer.height / 2, -(renderer.height / 2), 0, renderer.height); }

        canvas.ctx.arc(translateX(circle.x - renderer.camera.position.x), translateY(circle.y - renderer.camera.position.y), circle.radius / renderer.zoom, 0, 2 * Math.PI);

        renderer.#end(canvas);
        return renderer;
    }
    static ellipse(ellipse) {
        let canvas = renderer.canvas;
        renderer.#configCanvas(canvas);
        renderer.#begin(canvas);

        let translateX = (x) => { return math.map(x / renderer.zoom, -(renderer.width / 2), renderer.width / 2, 0, renderer.width); }
        let translateY = (y) => { return math.map(y / renderer.zoom, renderer.height / 2, -(renderer.height / 2), 0, renderer.height); }

        canvas.ctx.ellipse(translateX(ellipse.x - renderer.camera.position.x), translateY(ellipse.y - renderer.camera.position.y), ellipse.xradius / renderer.zoom, ellipse.yradius / renderer.zoom, 0, 0, 2 * Math.PI);

        renderer.#end(canvas);
        return renderer;
    }
    static text(text, position) {
        let canvas = renderer.canvas;
        renderer.#configCanvas(canvas);
        renderer.#begin(canvas);

        canvas.ctx.font = `${renderer.fontSize / renderer.zoom}px ${renderer.font}`;
        canvas.ctx.textAlign = renderer.textAlign;
        canvas.ctx.textBaseline = renderer.textBaseline;
        canvas.ctx.direction = renderer.textDirection;

        let translateX = (x) => { return math.map(x / renderer.zoom, -(renderer.width / 2), renderer.width / 2, 0, renderer.width); }
        let translateY = (y) => { return math.map(y / renderer.zoom, renderer.height / 2, -(renderer.height / 2), 0, renderer.height); }

        canvas.ctx.fillText(text, translateX(position.x - renderer.camera.position.x), translateY(position.y - renderer.camera.position.y));
        canvas.ctx.strokeText(text, translateX(position.x - renderer.camera.position.x), translateY(position.y - renderer.camera.position.y));

        renderer.#end(canvas);
        return renderer;
    }

    static polygon(poly) {
        let canvas = renderer.canvas;
        renderer.#configCanvas(canvas);
        renderer.#begin(canvas);

        let translateX = (x) => { return math.map(x / renderer.zoom, -(renderer.width / 2), renderer.width / 2, 0, renderer.width); }
        let translateY = (y) => { return math.map(y / renderer.zoom, renderer.height / 2, -(renderer.height / 2), 0, renderer.height); }

        canvas.ctx.moveTo(translateX(poly.translated[0].x - renderer.camera.position.x), translateY(poly.translated[0].y - renderer.camera.position.y));
        for(let i = 1; i <= poly.translated.length; i++) {
            canvas.ctx.lineTo(translateX(poly.translated[i % poly.translated.length].x - renderer.camera.position.x), translateY(poly.translated[i % poly.translated.length].y - renderer.camera.position.y));
        }

        renderer.#end(canvas);
        return renderer;
    }
}