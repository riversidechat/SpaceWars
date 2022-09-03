class PowerUpManager {
    constructor(bounds) {
        this.powerUps = [];

        this.bounds = bounds;
        this.qtree = new QuadTree(this.bounds);
    }
    update(bullet_manager, ship_manager) {
        for(let i = this.powerUps.length - 1; i >= 0; i--) {
            let kill = this.powerUps[i].update(bullet_manager, ship_manager);

            if(!kill) continue;
            this.qtree.remove(this.powerUps[i].qtree_item);
            this.powerUps.splice(i, 1);
        }
    }
    draw() {
        let powerUps = this.qtree.search(renderer.area);
        for(let p of powerUps) {
            p.draw();
        }
    }
    add(p) {
        p.qtree_item = this.qtree.insert(p, p.shape.area);
        this.powerUps.push(p);
    }
}