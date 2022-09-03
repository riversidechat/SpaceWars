class ShipManager {
    constructor(num_players, num_enemies, bounds) {
        this.players = [];
        this.enemies = [];
        this.killed_enemies = [];
        this.killed_players = [];

        this.num_players = num_players;
        this.num_enemies = num_enemies;

        this.bounds = bounds;
        this.qtree = new QuadTree(bounds);

        this.timer = 0
        this.max_timer = 240; // In seconds
    }
    update(delta_time, bullet_manager, asteroid_manager) {    
        this.timer += delta_time;
        if(this.timer >= this.max_timer) {
            this.next_generation();
        }

        for(let i = this.players.length - 1; i >= 0; --i) {
            let kill = this.players[i].update(delta_time, this, bullet_manager, this.bounds);

            if(!kill) continue;
            this.killed_players.push(this.players.splice(i, 1)[0]);
            if(this.players.length == 0) {
                this.next_generation();
            }
        }

        for(let i = this.enemies.length - 1; i >= 0; --i) {
            let kill = this.enemies[i].update(delta_time, this, bullet_manager, asteroid_manager, this.bounds);

            if(!kill) continue;
            this.killed_players.push(this.enemies.splice(i, 1)[0]);

            if(this.enemies.length == 0) {
                this.next_generation();
            }
        }
        
        this.update_qtree();
        
        return false
    }
    update_qtree() {
        this.qtree.clear();
        for(let player of this.players) {
            this.qtree.insert(player, player.shape.area);
        }
        for(let enemie of this.enemies) {
            this.qtree.insert(enemie, enemie.shape.area);
        }
    }
    draw() {
        let ships = this.qtree.search(renderer.area);
        for(let ship of ships) {
            ship.draw(this);
        }
    }
    add(ship) {
        ship.qtree_item = this.qtree.insert(ship, ship.shape.area);

        if(ship instanceof Player) {
            this.num_players++;
            this.players.push(ship);
        }else if(ship instanceof Enemy) {
            this.num_enemies++;
            this.enemies.push(ship);
        }
    }

    next_generation() {
        this.clean_up();
        let scores = this.normalize_scores();
        let generation = this.new_generation(scores);
        this.enemies = generation.enemies;
        this.players = generation.players;
    }
    clean_up() {
        this.timer = 0;
        this.qtree.clear();

        this.players = this.players.concat(this.killed_players);
        this.killed_players = [];

        this.enemies = this.enemies.concat(this.killed_enemies);
        this.killed_enemies = [];
    }
    normalize_scores() {
        let sum = 0;
        let scores = new Array(this.enemies.length);

        for(let ship of this.enemies) {
            sum += ship.calculate_score();    
        }

        for(let i = 0; i < this.enemies.length; ++i) {
            scores[i] = this.enemies[i].calculate_score() / sum;
        }

        return scores;
    }
    new_generation(scores) {
        let enemies = new Array(this.num_enemies);
        for(let i = 0; i < enemies.length; ++i) {
            if(this.enemies.length > 0) {
                enemies[i] = new Enemy(this.pool_selection(scores).nn, vec2.random(this.bounds.left, this.bounds.right, bounds.top, bounds.bottom));

                enemies[i].nn.mutate(this.mutate);
            } else {
                enemies[i] = new Enemy(vec2.random(this.bounds.left, this.bounds.right, bounds.top, bounds.bottom));
            }
            this.qtree.insert(enemies[i], enemies[i].shape.area);
        }
        
        let players = new Array(this.num_players);
        for(let i = 0; i < players.length; ++i) {
            players[i] = new Player(vec2.random(this.bounds.left, this.bounds.right, bounds.top, bounds.bottom));
            this.qtree.insert(players[i], players[i].shape.area);
        }
    
        return {enemies: enemies, players: players};
    }
    pool_selection(scores) {
        let index = 0;
        let r = math.random(0, 1);
        
        while(r > 0) {
            r -= scores[index];
        
            ++index;
        }
        --index;
        
        return this.enemies[index];
    }
    mutate(x) {
        if (math.random(0, 1) < 0.1) {
            let newx = x + math.random(-0.5, 0.5);
            return newx;
        } else {
            return x;
        }
    }
}