class camera {
    constructor(position) {
        this.real_position = position.clone();
        this.position = position.clone();
        this.shake_position = vec2.zero;
        this.shake_velocity = vec2.zero;
        this.follow = null;
    }
    calculatePosition(v) {
        return vec2.subtract(v, this.position);
    }
    // follow(obj) {
    //     this.follow = obj;
    // }
    update(delta_time) {
        let deltaTime = 60 * delta_time;

        this.shake_velocity.add(vec2.subtract(vec2.zero, this.shake_position).divide(10).multiply(deltaTime));
        this.shake_velocity.add(vec2.multiply(this.shake_velocity, 0.9).subtract(this.shake_velocity).multiply(deltaTime));
        if(this.shake_velocity.magnitude() < 0.1) this.shake_velocity = vec2.zero;
        this.shake_position.add(vec2.multiply(this.shake_velocity, deltaTime));
    }
    shake(v) {
        this.shake_velocity = v.clone();
    }
    move_softly(pos, bounds) {
        this.real_position.add(vec2.divide(vec2.subtract(pos, this.real_position), 8));
        this.position = vec2.add(this.real_position, this.shake_position);

        if(bounds) {
            this.position.x = Math.min(Math.max(this.position.x, bounds.left + renderer.width / 2 * renderer.zoom), bounds.right - renderer.width / 2 * renderer.zoom);
            this.position.y = Math.min(Math.max(this.position.y, bounds.top + renderer.height / 2 * renderer.zoom), bounds.bottom - renderer.height / 2 * renderer.zoom);
        }
    }
}