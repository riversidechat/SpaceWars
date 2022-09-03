class PowerUp {
    constructor(position, type) {
        this.position = position;
        this.type = type;
        this.shape = PowerUp.construct(position, type);

        this.qtree_item = undefined;
    }
    static construct(position, type) {
        let numPoints = 10;
        let radius = 50;
        let shape = new Polygon(position, 0, []);

        for(let i = 0; i < numPoints; i++) {
            let point = vec2.create(Math.cos((2 * Math.PI / numPoints) * i) * radius, Math.sin((2 * Math.PI / numPoints) * i) * radius);
            shape.add(point);
        }

        shape.update();

        return shape;
    }
    getColor() {
        switch(this.type) {
            case "health": return color.red;
            default: return color.white;
        }
    }
    draw() {
        renderer.fillColor = this.getColor();
        renderer.strokeColor = renderer.fillColor;
        renderer.strokeWeight = 5;
        renderer.polygon(this.shape);
    }
    update(bullet_manager, ship_manager) {
        let bullets = bullet_manager.qtree.search(this.shape.area);
        for(let bullet of bullets) {
            if(poly_line_collision(this.shape, bullet.shape)) {
                this.applyPowerUp(bullet.owner);

                bullet.hit(this);
                bullet.kill();

                return true;
            }
        }

        let ships = ship_manager.qtree.search(this.shape.area);
        for(let ship of ships) {
            if(SAT(ship.shape, this.shape)) {
                this.applyPowerUp(ship);

                return true;
            }
        }

        return false;
    }
    applyPowerUp(ship) {
        switch(this.type) {
            case 'health': {
                ship.health += 25;
            } break;
        }
    }
}