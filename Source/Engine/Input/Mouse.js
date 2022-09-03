class mouse
{
    constructor() {}
    static position = vec2.zero;
    static down = false;
    static pressed = false;
    static released = false;

    static move(e)
    {
        let translateX = (x) => { return math.map(x, 0, renderer.width, -(renderer.width/2), renderer.width/2); }
        let translateY = (y) => { return math.map(y, 0, renderer.height, renderer.height/2, -(renderer.height/2)); }

        mouse.position.x = translateX(e.x);
        mouse.position.y = translateY(e.y);
    }
    static event(e)
    {
        var state = (e.type == "mousedown");
        mouse.down = state;
        mouse.pressed = state;
        mouse.released = !state;
    }
    static update()
    {
        mouse.pressed = false;
        mouse.released = false;
    }
    static worldSpacePosition() {
        return vec2.add(vec2.multiply(this.position, renderer.zoom), renderer.camera.position);
    }
}

document.addEventListener("mousemove", mouse.move);
document.addEventListener("mousedown", mouse.event);
document.addEventListener("mouseup", mouse.event);