class AsteroidManager {
    constructor(bounds, spawn_time) {
        this.asteroids = [];
        this.bounds = bounds;
        this.qtree = new QuadTree(bounds, 16);

        this.spawn_timer = 0;
        this.spawn_time = spawn_time;
    }
    update(delta_time, bullet_manager, ship_manager) {
        this.spawn_timer += delta_time;
        if(this.spawn_timer >= this.spawn_time) {
            if(this.asteroids.length < 300)
                this.spawn();
            this.spawn_timer -= this.spawn_time;
        }
        for(let i = this.asteroids.length - 1; i >= 0; --i) {
            if(this.asteroids[i].update(delta_time, bullet_manager, ship_manager, this, this.bounds)) {
                this.asteroids.splice(i, 1);
            }
        }
        this.qtree.clear();
        for(let asteroid of this.asteroids) {
            this.qtree.insert(asteroid, asteroid.shape.area);
        }
    }
    spawn() {
        let pos = vec2.random(this.bounds.left, this.bounds.right, this.bounds.top, this.bounds.bottom);
        let asteroid = new Asteroid(pos, 0, vec2.random(-4, 4), math.random(-0.025, 0.025), 10, math.random(1, 8) * 50);
        let counter = 0;

        while(renderer.area.overlaps(asteroid.shape.area) && counter++ < 5) {
            pos = vec2.random(this.bounds.left, this.bounds.right, this.bounds.top, this.bounds.bottom);
            asteroid.position = pos;
            asteroid.shape.update();
        }

        if(!renderer.area.overlaps(asteroid.shape.area))
            this.add(asteroid);
    }
    draw() {
        let asteroids = this.qtree.search(renderer.area);
        for(let a of asteroids) {
            a.draw();
        }
    }
    add(asteroid) {
        this.qtree.insert(asteroid, asteroid.shape.area);
        this.asteroids.push(asteroid);
    }
}