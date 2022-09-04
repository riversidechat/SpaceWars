class Bullet {
    constructor(position, velocity, rotation, damage, owner, target_id, end_time = 2) {
        this.position = (position != undefined ? position.clone() : vec2.zero);
        this.velocity = (velocity != undefined ? velocity.clone() : vec2.zero);
        this.rotation = rotation;
        this.velocity_damping = 0.99


        this.damage = damage || 0;
        this.owner = owner || -1;
        this.target_id = target_id || -1;
        this.timer = 0;
        this.end_time = end_time || 2;
        this.size = 200;
    }
    draw() {
        let c = color.create(0, 180, 255);
        renderer.strokeColor = c;
        renderer.strokeWeight = 5;
        renderer.line(this.position, vec2.create(Math.cos(this.rotation) * this.size, Math.sin(this.rotation) * this.size).add(this.position))

        c.a = 0.2;
        renderer.strokeColor = c;
        renderer.strokeWeight = 35;
        renderer.line(this.position, vec2.create(Math.cos(this.rotation) * this.size, Math.sin(this.rotation) * this.size).add(this.position))
    }
    update(delta_time, bounds) {
        let deltaTime = 60 * delta_time;

        this.timer += delta_time;
        if(this.timer >= this.end_time) return true;

        // this.velocity.add(vec2.multiply(this.velocity, this.velocity_damping).subtract(this.velocity).multiply(deltaTime));
        if(this.velocity.magnitude() <= 0.1) return true;
        this.position.add(vec2.multiply(this.velocity, deltaTime));

        return false;
    }
    hit(obj) {
        this.owner.rounds_hit++;
        if(obj instanceof Ship) {
            obj.hit(this);
            if(obj.id == this.target_id && obj.health <= 0) this.owner.bonus++

            if(obj.health <= 0)
                this.owner.kills++;
        }
    }
    kill() {
        this.timer = this.end_time;
        this.velocity = vec2.zero;
    }
    get shape() {
        return new line(this.position, vec2.create(Math.cos(this.rotation) * this.size, Math.sin(this.rotation) * this.size).add(this.position))
    }
    get area() {
        let size = vec2.create(Math.cos(this.rotation) * this.size, Math.sin(this.rotation) * this.size);
        let x1 = Math.min(this.position.x, this.position.x + size.x)
        let y1 = Math.min(this.position.y, this.position.y + size.y)
        let x2 = Math.max(this.position.x, this.position.x + size.x)
        let y2 = Math.max(this.position.y, this.position.y + size.y)
        return new rect(x1, y1, x2 - x1, y2 - y1);
    }
}