class Asteroid {
    static #id_counter = 0;

    constructor(a, b, c, d, e, f) {
        this.position = a || vec2.zero;
        this.rotation = b || 0;
        this.velocity = c || vec2.zero;
        this.rotation_speed = d || 0;
        this.health = (f? f / 4 : 50);
        this.radius = f || 100;
        this.points = e || 10;

        this.has_split = false;
        this.id = Asteroid.#id_counter++;

        if(typeof e == 'object') {
            this.shape = e;
        } else {
            this.shape = this.construct(e || 10, f || 100, (f || 100) / 10);
        }
    }
    construct(num_points, radius, radius_range) {
        let points = new Array(num_points);
        for(let i = 0; i < num_points; i++) {
            let range = ((Math.PI * 2) / num_points) / 2;
            let rotation = i * ((Math.PI * 2) / num_points) + math.random(-range, range);

            let dist = math.random(radius - radius_range, radius + radius_range)
            points[i] = vec2.create(Math.cos(rotation) * dist, Math.sin(rotation) * dist);
        }

        return new Polygon(this.position, this.rotation, points);
    }
    update(delta_time, bullet_manager, ship_manager, asteroid_manager, bounds) {
        let deltaTime = 60 * delta_time;
        this.rotation += this.rotation_speed * deltaTime;
        this.position.add(vec2.multiply(this.velocity, deltaTime));
        this.shape.rotation = this.rotation;
        this.shape.update();

        this.contain(bounds);

        this.check_collision(delta_time, bullet_manager, ship_manager, asteroid_manager)
        if(this.health <= 0) return true;

        return false;
    }
    contain(bounds) {
        let area = this.shape.area;
        let update = false;

        if(area.left > bounds.right) { this.position.x = bounds.left - (area.right - this.position.x); update = true; }
        if(area.right < bounds.left) { this.position.x = bounds.right + (this.position.x - area.left); update = true; }
        if(area.top > bounds.bottom) { this.position.y = bounds.top - (area.bottom - this.position.y); update = true; }
        if(area.bottom < bounds.top) { this.position.y = bounds.bottom + (this.position.y - area.top); update = true; }

        if(update) this.shape.update();
    }
    check_collision(delta_time, bullet_manager, ship_manager, asteroid_manager) {
        let deltaTime = 60 * delta_time;

        let bullets = bullet_manager.qtree.search(this.shape.area);

        for(let b of bullets) {
            if(!poly_line_collision(this.shape, b.shape))
                continue;

            this.health -= b.damage;
            if(this.health <= 0 && this.radius >= 125 && !this.has_split) this.split(asteroid_manager);
            b.hit(this);
            b.kill();
        }

        let ships = ship_manager.qtree.search(this.shape.area);
        for(let s of ships) {
            if(!SAT_static(s.shape, this.shape))
                continue;

            // this.health -= s.velocity.magnitude() / 5 * deltaTime;
            // if(this.health <= 0 && this.radius >= 125 && !this.has_split) this.split(asteroid_manager);

            // s.health -= 10;
            // s.velocity.multiply(-1);
        }

        let asteroids = asteroid_manager.qtree.search(this.shape.area);
        for(let a of asteroids) {
            if(a.id == this.id)
                continue;
                
            if(!SAT_static(a.shape, this.shape))
                continue;

            // this.health -= s.velocity.magnitude() / 5 * deltaTime;
            // if(this.health <= 0 && this.radius >= 125 && !this.has_split) this.split(asteroid_manager);

            // s.health -= 10;
            // s.velocity.multiply(-1);
        }
    }
    split(asteroid_manager) {
        this.has_split = true;
        let num = math.random_int(2, 4);
        let i = num;

        while(i--) {
            asteroid_manager.add(new Asteroid(vec2.add(this.position, vec2.random(-this.radius / 2, this.radius / 2)),
                                 math.random(-Math.PI, Math.PI),
                                 vec2.random(-this.velocity.x * (num / 2), this.velocity.x * (num / 2), -this.velocity.y * (num / 2), this.velocity.y * (num / 2)),
                                 math.random(-this.rotation_speed, this.rotation_speed),
                                 this.points,
                                 this.radius / num));
        }
    }
    draw() {
        renderer.strokeColor = color.white;
        renderer.strokeWeight = 5;

        this.shape.draw();
    }
}
function poly_line_collision(p, l) {
    for(let i = 0; i < p.translated.length; ++i) {
        let i2 = (i + 1) % p.translated.length;
        let p1 = p.translated[i];
        let p2 = p.translated[i2];

        if(line_line_collision(new line(p1, p2), l)) return true;
    }

    return false;
}
function line_line_collision(a, b) {
    let uA = ((b.x2 - b.x1) * (a.y1 - b.y1) - (b.y2 - b.y1) * (a.x1 - b.x1)) / ((b.y2 - b.y1) * (a.x2 - a.x1) - (b.x2 - b.x1) * (a.y2 - a.y1));
    let uB = ((a.x2 - a.x1) * (a.y1 - b.y1) - (a.y2 - a.y1) * (a.x1 - b.x1)) / ((b.y2 - b.y1) * (a.x2 - a.x1) - (b.x2 - b.x1) * (a.y2 - a.y1));

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        return true;
    }
    return false;
}