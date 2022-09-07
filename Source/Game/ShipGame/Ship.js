class ShipStats {
    constructor() {
        this.health = 100;
        this.kills = 0;
        this.bonus = 0;
        this.rounds_hit = 0;
        this.rounds_fired = 0;
    }
    calculate_score() {
        return (this.health / 20 +
                this.kills * 2 +
                this.bonus * 4
                );
    }
}

class Ship extends ShipStats {
    static #id_counter = 0;
    constructor(a, b, c, d) {
        super();
        this.position = a || vec2.zero;
        this.velocity = b || vec2.zero;
        this.rotation = c || 0;
        this.rotation_velocity = d || 0;

        this.rotation_acceleration = 0;
        this.acceleration = 0;

        this.velocity_damping = 0.99;
        this.rotation_damping = 0.9;

        this.base_bullet_velocity = 75;
        this.gun_accuracy = math.map(99, 0, 100, Math.PI, 0); // range between 0% and 100%
        this.gun_delay = 0.2; // deley in seconds
        this.boost_delay = 0.0; // deley in seconds
        this.gun_timer = this.gun_delay;
        this.target_ship = undefined;

        this.ship_size = 40;
        this.id = Ship.#id_counter++;

        this.shape = new Polygon(this.position, this.rotation, [vec2.create(this.ship_size, 0),
                                                                vec2.create(-this.ship_size * (2/3), this.ship_size * (3 / 4)),
                                                                vec2.create(-this.ship_size * (2/3), -this.ship_size * (3 / 4))]);
        this.qtree_item = undefined;
    }
    draw_health_bar() {
        const health_bar_length = 100;
        const padding = 25;

        renderer.strokeWeight = 20;
        renderer.strokeColor = color.create(50, 50, 50);

        let pos = vec2.create(Math.cos(this.rotation) * -(this.ship_size * (3 / 4) + health_bar_length / 2 + padding), Math.sin(this.rotation) * -(this.ship_size * (2/3) + padding)).add(this.position);
        let a = vec2.add(pos, vec2.create(-health_bar_length / 2, 0));
        let b = vec2.add(pos, vec2.create(health_bar_length / 2, 0)); 
        let c = vec2.add(pos, vec2.create((this.health / 100) * health_bar_length - (health_bar_length / 2), 0));
        renderer.line(a, b);
        renderer.strokeWeight = 10;
        renderer.strokeColor = color.create(100, 0, 0);
        renderer.line(a, b);
        renderer.strokeColor = color.create(0, 255, 0);
        renderer.line(a, c);
    }
    draw() {
        renderer.strokeColor = color.white;
        renderer.strokeWeight = 5;
        this.shape.draw();
        this.draw_health_bar();
    }
    can_fire() {
        return this.gun_timer >= this.gun_delay + this.boost_delay;
    }
    fire(bullet_manager, target_id = -1) {
        let pos = vec2.create(Math.cos(this.rotation + this.rotation_velocity) * this.ship_size * (6/5), Math.sin(this.rotation + this.rotation_velocity) * this.ship_size * (6/5)).add(this.velocity).add(this.position);
        let bullet_rotation = this.rotation + math.random(-this.gun_accuracy, this.gun_accuracy) + this.rotation_velocity;
        let bullet_velocity = vec2.create(Math.cos(bullet_rotation) * this.base_bullet_velocity, Math.sin(bullet_rotation) * this.base_bullet_velocity).add(this.velocity);

        bullet_manager.add(new Bullet(pos,
                                      bullet_velocity, 
                                      bullet_rotation,
                                      25,
                                      this,
                                      target_id,
                                      math.random(0.8, 1)));
        this.gun_timer = 0;

        const recoilPower_pos = 1;
        const recoilPower_vel = 0.5;
        let recoil = vec2.create(Math.cos(this.rotation), Math.sin(this.rotation));
        this.position.add(vec2.multiply(recoil, -recoilPower_pos))
        this.velocity.add(vec2.multiply(recoil, -recoilPower_vel))

        this.rounds_fired++;
    }
    update(delta_time, bounds) {
        let deltaTime = 60 * delta_time;

        this.gun_timer += delta_time;

        this.rotation_velocity += (this.rotation_acceleration + (this.rotation_velocity * this.rotation_damping - this.rotation_velocity)) * deltaTime;
        this.rotation += this.rotation_velocity * deltaTime;
        
        let acceleration_vec = vec2.create(this.acceleration * Math.cos(this.rotation), this.acceleration * Math.sin(this.rotation));
        this.velocity.add(vec2.add(acceleration_vec, vec2.multiply(this.velocity, this.velocity_damping).subtract(this.velocity)).multiply(deltaTime));
        this.position.add(vec2.multiply(this.velocity, deltaTime));
        this.shape.rotation = this.rotation;
        this.shape.update();

        this.contain(bounds);
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
    check_collision(bullet_manager, ship_manager) {
        let bullets = bullet_manager.qtree.search(this.shape.area);
        for(let b of bullets) {
            if(!poly_line_collision(this.shape, b.shape))
                continue;

            if(b.owner.id == this.id)
                continue;

            b.hit(this);
            b.kill();
        }

        let ships = ship_manager.qtree.search(this.shape.area);
        for(let s of ships) {
            if(s.id == this.id)
                continue;

            if(!SAT_static(s.shape, this.shape))
                continue;
        }
    }
    hit(bullet) {
        this.health -= bullet.damage;
    }
}

class Player extends Ship {
    constructor(a, b, c, d) {
        super(a, b, c, d);
        
        this.aim_assist_percentage = 100;
        this.aim_assist_timer = 0;
        this.aim_assist_max_timer = 0.5;
    }
    find_ships_near_me(ship_manager) {
        const size = 15000;
        let area = new rect(this.position.x - (size / 2), this.position.y - (size / 2), size, size);
        
        return ship_manager.qtree.search(area);
    }
    find_bullets_near_me(bullet_manager) {
        const size = 1000;
        let area = new rect(this.position.x - (size / 2), this.position.y - (size / 2), size, size);
        
        return bullet_manager.qtree.search(area);
    }
    aim_assist(delta_time) {
        const max_distance = 15000;
        const max_angle = Math.PI / 8;
        const size = 10000;

        let area = new rect(this.position.x - (size / 2), this.position.y - (size / 2), size, size);
        
        let target = undefined;

        let ships = ship_manager.qtree.search(area);

        if(ships.length == 1) return;

        let min_angle = Infinity;
        for(let ship of ships) {
            if(ship.id == this.id) continue;

            let target_position = vec2.subtract(ship.position, this.position).normalize().add(this.position);
            let real_position = vec2.add(vec2.create(Math.cos(this.rotation), Math.sin(this.rotation)), this.position);
            let c = target_position.distance(real_position);
            let angle = Math.acos(((c ** 2) - 2) / -2);

            if(ship.position.distance(this.position) < max_distance && angle < max_angle) {
                if(angle < min_angle) {
                    min_angle = angle;
                    target = ship;
                }
            }
        }

        if(target == undefined) {
            this.target_ship = undefined;
        } else if(this.target_ship == undefined) {
            this.target_ship = target;
        }
    }
    handle_user_input(delta_time, bullet_manager) {
        let deltaTime = 60 * delta_time;
        let up = keyboard.getKey(keyboard.keys.up_arrow).down || keyboard.getKey(keyboard.keys.w).down;
        let down = keyboard.getKey(keyboard.keys.down_arrow).down || keyboard.getKey(keyboard.keys.s).down;
        let left = keyboard.getKey(keyboard.keys.left_arrow).down || keyboard.getKey(keyboard.keys.a).down;
        let right = keyboard.getKey(keyboard.keys.right_arrow).down || keyboard.getKey(keyboard.keys.d).down;
        let boost = 3 - (keyboard.getKey(keyboard.keys.shift_left).down * 1.5);
        this.acceleration = (up - down) / boost * deltaTime;
        this.rotation_acceleration = (left - right) / 150 * deltaTime;
        
        this.boost_delay = keyboard.getKey(keyboard.keys.shift_left).down / 10;

        if(mouse.down) {
            if(this.target_ship != undefined)
                this.aim_assist_timer += delta_time;
            else
                this.aim_assist_timer = Math.max(0, this.aim_assist_timer - delta_time);

            if(this.can_fire()) {
                this.fire(bullet_manager);
            }    
        }
        
        if(keyboard.getKey(keyboard.keys.space).down) {
            this.rotation_acceleration = 0;
            
            let desired_angle = vec2.subtract(mouse.worldSpacePosition(), this.position).normalize();
            let current_angle = vec2.create(Math.cos(this.rotation), Math.sin(this.rotation));
            current_angle.add(vec2.multiply(vec2.subtract(desired_angle, current_angle), 0.1 * deltaTime));
            this.rotation = Math.atan2(current_angle.y, current_angle.x);
        }
    }
    update(delta_time, ship_manager, bullet_manager, bounds) {
        let deltaTime = 60 * delta_time;
        this.gun_timer += delta_time;
        if(this.health <= 0) return true;
        
        this.aim_assist(delta_time);
        this.enemy_bullet_shake(bullet_manager);
        this.handle_user_input(delta_time, bullet_manager);

        super.update(delta_time, bounds);
        this.check_collision(bullet_manager, ship_manager);

        return false;
    }
    enemy_bullet_shake(bullet_manager) {
        let bullets = this.find_bullets_near_me(bullet_manager);
        if(bullets.length == 0) return;
        
        let index = -1;
        let min_distance = Infinity;
        for(let i = 0; i < bullets.length; i++) {
            let bullet = bullets[i];
            if(bullet.owner.id == this.id) continue;
            
            let distance = bullet.position.distance(this.position)
            if(distance < min_distance) {
                index = i;
                min_distance = distance;
            }
        }
        
        if(index == -1) return;
        
        const max_shake = 50;
        let bullet = bullets[index];
        renderer.camera.shake(vec2.subtract(bullet.position, this.position).normalize().multiply(-max_shake * (1 / (min_distance / 10))));
    }
    draw(ship_manager) {
        const arrow_dist = 200;
        const arrow_size = 25;
        super.draw();
        
        renderer.strokeWeight = 5;
        renderer.strokeColor = color.red;
        let ships = this.find_ships_near_me(ship_manager);
        
        let poly = new Polygon(vec2.zero, 0, [vec2.create(arrow_size * (2/3), 0),
        vec2.create(-arrow_size * (2/3), arrow_size * (3/4)),
        vec2.create(-arrow_size * (2/3), -arrow_size * (3/4))]);
        
        for(let ship of ships) {
            if(ship.id == this.id) continue;
            
            let pos = vec2.subtract(ship.position, this.position).normalize().multiply(arrow_dist).add(this.position);
            let rot = math.angle(this.position, ship.position);
            poly.position = pos;
            poly.rotation = rot;
            poly.update();

            poly.draw();
        }
    }
    hit(bullet) {
        super.hit(bullet);
        const max_shake_power = 250;
        renderer.camera.shake(vec2.subtract(bullet.position, this.position).normalize().multiply(-(bullet.damage / 100 * max_shake_power)));
    }
    fire(bullet_manager) {
        let pos = vec2.create(Math.cos(this.rotation + this.rotation_velocity) * this.ship_size * (6/5), Math.sin(this.rotation + this.rotation_velocity) * this.ship_size * (6/5)).add(this.velocity).add(this.position);
        let bullet_rotation = this.rotation + this.rotation_velocity;
        let bullet_velocity = 0;
        
        if(this.target_ship != undefined) {
            let interception = intercept(this, this.base_bullet_velocity, this.target_ship);
            
            let desired_angle = vec2.subtract(interception, this.position).normalize();
            let current_angle = vec2.create(Math.cos(bullet_rotation), Math.sin(bullet_rotation));
            let t = math.lerp(0, (this.aim_assist_percentage / 100), (math.clamp(this.aim_assist_timer, 0, this.aim_assist_max_timer) / this.aim_assist_max_timer));
            current_angle.add(vec2.multiply(vec2.subtract(desired_angle, current_angle), t));
            bullet_rotation = Math.atan2(current_angle.y, current_angle.x);
        }
        
        bullet_velocity = vec2.create(Math.cos(bullet_rotation) * this.base_bullet_velocity, Math.sin(bullet_rotation) * this.base_bullet_velocity).add(this.velocity);
        
        let target_id = (this.target_ship != undefined)? this.target_ship.id : -1;
        bullet_manager.add(new Bullet(pos,
                                      bullet_velocity, 
                                      bullet_rotation,
                                      25,
                                      this,
                                      target_id,
                                      math.random(0.8, 1)));
        this.gun_timer = 0;
                                      
        const recoilPower_pos = 0;//1;
        const recoilPower_vel = 0//0.5;
        let recoil = vec2.create(Math.cos(this.rotation), Math.sin(this.rotation));
        this.position.add(vec2.multiply(recoil, -recoilPower_pos))
        this.velocity.add(vec2.multiply(recoil, -recoilPower_vel))
        
        this.rounds_fired++;

        renderer.camera.shake(vec2.random(-10, 10));
    }
}

class Enemy extends Ship {
    constructor(nn, a, b, c, d) {
        super(a, b, c, d);

        if(nn != undefined) this.nn = new NeuralNetwork(nn);
        else this.nn = new NeuralNetwork([7, 14, 28, 14, 4]);
        this.target_position;
    }
    find_closest_ship(ship_manager) {
        const area_growth = 2;
        const start_area = 1000;
        let area = new rect(this.position.x - (start_area / 2), this.position.y - (start_area / 2), start_area, start_area);
        let found = [];
        let counter = 0;
        
        while(found.length <= 1 && counter++ < 5) {
            found = ship_manager.qtree.search(area);
            area.w *= area_growth;
            area.h *= area_growth;
            area.x = this.position.x - (area.w / 2);
            area.y = this.position.y - (area.h / 2);
        }

        if(found.length == 1) return undefined;

        let index = -1;
        let min_dist = Infinity
        for(let i = 0; i < found.length; ++i) {
            if(found[i].id == this.id)
                continue;

            let dist = found[i].position.distance(this.position)
            if(dist < min_dist) {
                min_dist = dist;
                index = i;
            }
        }

        return found[index];
    }
    find_closest_bullet(bullet_manager) {
        const area_growth = 2;
        const start_area = 500;
        let area = new rect(this.position.x - (start_area / 2), this.position.y - (start_area / 2), start_area, start_area);
        let found = [];
        let counter = 0;
        
        while(found.length <= 1 && counter++ < 5) {
            found = bullet_manager.qtree.search(area);
            area.w *= area_growth;
            area.h *= area_growth;
            area.x = this.position.x - (area.w / 2);
            area.y = this.position.y - (area.h / 2);
        }

        if(found.length == 1) return undefined;

        let index = -1;
        let min_dist = Infinity
        for(let i = 0; i < found.length; ++i) {
            if(found[i].id == this.id)
                continue;

            let dist = found[i].position.distance(this.position)
            if(min_dist > dist) {
                min_dist = dist;
                index = i;
            }
        }

        return found[index];
    }
    find_closest_asteroid(asteroid_manager) {
        const area_growth = 2;
        const start_area = 1000;
        let area = new rect(this.position.x - (start_area / 2), this.position.y - (start_area / 2), start_area, start_area);
        let found = [];
        let counter = 0;
        
        while(found.length <= 1 && counter++ < 5) {
            found = asteroid_manager.qtree.search(area);
            area.w *= area_growth;
            area.h *= area_growth;
            area.x = this.position.x - (area.w / 2);
            area.y = this.position.y - (area.h / 2);
        }

        if(found.length == 1) return undefined;

        let index = -1;
        let min_dist = Infinity
        for(let i = 0; i < found.length; ++i) {
            if(found[i].id == this.id)
                continue;

            let dist = found[i].position.distance(this.position)
            if(min_dist > dist) {
                min_dist = dist;
                index = i;
            }
        }

        return found[index];
    }
    handle_nn(delta_time, ship_manager, bullet_manager, asteroid_manager, bounds) {
        let deltaTime = 60 * delta_time;

        let closest_ship = this.find_closest_ship(ship_manager) || { position: this.position, velocity: vec2.zero };
        let closest_bullet = this.find_closest_bullet(bullet_manager) || { position: this.position, velocity: vec2.zero };
        let closest_asteroid = this.find_closest_asteroid(asteroid_manager) || { position: this.position, velocity: vec2.zero };

        this.target_ship = (closest_ship.id != undefined? closest_ship : undefined);

        let inputs = new Array(7);
        inputs[0] = (closest_ship.position.distance(this.position)) / (Math.sqrt(bounds.w * bounds.w + bounds.h * bounds.h));
        inputs[1] = (closest_bullet.position.distance(this.position)) / (Math.sqrt(bounds.w * bounds.w + bounds.h * bounds.h));
        inputs[2] = (closest_asteroid.position.distance(this.position)) / (Math.sqrt(bounds.w * bounds.w + bounds.h * bounds.h));
        inputs[3] = math.wrapMinMax((math.angle(this.position, closest_ship.position) - this.rotation), -Math.PI, Math.PI) / Math.PI;
        inputs[4] = math.wrapMinMax((math.angle(this.position, closest_bullet.position) - this.rotation), -Math.PI, Math.PI) / Math.PI;
        inputs[5] = math.wrapMinMax((math.angle(this.position, closest_asteroid.position) - this.rotation), -Math.PI, Math.PI) / Math.PI;
        inputs[6] = (this.health - 50) / 50
        let outputs = this.nn.feedForward(inputs);

        this.acceleration = outputs[0] / (3 - ((outputs[1] + 1) / 2) * 1.5) * deltaTime;
        this.rotation_acceleration = outputs[2] / 150 * deltaTime;

        this.boost_delay = (Math.round((outputs[1] + 1)) / 2) / 10;
        
        if(outputs[3] >= 0 && this.can_fire()) {
            this.fire(bullet_manager);
        }
    }
    update(delta_time, ship_manager, bullet_manager, asteroid_manager, bounds) {
        let deltaTime = 60 * delta_time;
        this.gun_timer += delta_time;
        
        if(this.health <= 0) return true;
        
        this.handle_nn(delta_time, ship_manager, bullet_manager, asteroid_manager, bounds);
        
        super.update(delta_time, bounds);
        this.check_collision(bullet_manager, ship_manager);
        
        return false;
    }
}

function intercept(shooter, bullet_speed, target) {
    let relativeVelocity = vec2.subtract(target.velocity, shooter.velocity);
    let toTarget = vec2.subtract(target.position, shooter.position);
    let a = vec2.dot(relativeVelocity, relativeVelocity) - (bullet_speed * bullet_speed);
    let b = 2 * vec2.dot(relativeVelocity, toTarget);
    let c = vec2.dot(toTarget, toTarget);

    let p = -b / (2 * a);
    let q = Math.sqrt((b * b) - 4 * a * c) / (2 * a);

    let t1 = p - q;
    let t2 = p + q;
    let t;

    if (t1 > t2 && t2 > 0)
        t = t2;
    else
        t = t1;

    return vec2.add(target.position, vec2.multiply(relativeVelocity, t));
}