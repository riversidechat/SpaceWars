class BulletManager {
    constructor(bounds) {
        this.bullets = [];
        this.bounds = bounds;
        this.qtree = new QuadTree(bounds);
    }
    update(delta_time) {
        for(let i = this.bullets.length - 1; i >= 0; --i) {
            if(this.bullets[i].update(delta_time, this.bounds)) {
                this.bullets.splice(i, 1);
            }
        }

        this.qtree.clear();
        for(let bullet of this.bullets) {
            this.qtree.insert(bullet, bullet.area);
        }
    }
    draw() {
        let bullets = this.qtree.search(renderer.area);
        for(let b of bullets) {
            if(b.timer < b.end_time)
                b.draw();
        }
    }
    add(bullet) {
        this.qtree.insert(bullet, bullet.area);
        this.bullets.push(bullet);
    }
}