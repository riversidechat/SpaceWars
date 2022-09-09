let mainCanvas;
let bounds = new rect(-32000, -32000, 64000, 64000)
let ship_manager = new ShipManager(0, 0, bounds);
let bullet_manager = new BulletManager(bounds);
let asteroid_manager = new AsteroidManager(bounds, 1);
let powerUp_manager = new PowerUpManager(bounds);
let mode = "intro"
let intro_timer = 0;
let intro_end_time = 1;
let updates = 1;
const game_zoom = 5;

function setup() {
    mainCanvas = renderer.createCanvas(new rect(0, 0, renderer.screenWidth(), renderer.screenHeight()));
    renderer.zoom = 1;
    
    ship_manager.add(new Player(vec2.zero, vec2.zero, Math.PI / 2));
    for(let i = 0; i < 50; ++i) {
        let ship = new Enemy(undefined, vec2.random(bounds.left, bounds.right, bounds.top, bounds.bottom), vec2.zero, Math.PI / 2);

        let found = [];
        do {
            found = ship_manager.qtree.search(ship.shape.area);

            if(found.length != 0) {
                ship.position = vec2.random(bounds.left, bounds.right, bounds.top, bounds.bottom);
                ship.shape.position = ship.position;
                ship.shape.update();
            }
        } while(found.length != 0);

        ship_manager.add(ship);
    }

    for(let i = 0; i < 300; ++i) {
        let a = new Asteroid(vec2.random(bounds.left, bounds.right, bounds.top, bounds.bottom),
                            0,
                            vec2.random(-10, 10 ),
                            math.random(-0.025, 0.025),
                            10,
                            math.random(1, 8) * 50);
        let found = [];
        do {
            found = ship_manager.qtree.search(a.shape.area);

            if(found.length != 0) {
                a.position = vec2.random(bounds.left, bounds.right, bounds.top, bounds.bottom);
                a.shape.position = a.position;
                a.shape.update();
            }
        } while(found.length != 0);

        asteroid_manager.add(a);
    }

    for(let i = 0; i < 100; ++i) {
        powerUp_manager.add(new PowerUp(vec2.random(bounds.left, bounds.right, bounds.top, bounds.bottom), 'health'));
    }
} 

async function update(delta_time) {
    renderer.activeCanvas = mainCanvas;
    renderer.width = renderer.screenWidth();
    renderer.height = renderer.screenHeight();
    renderer.background(new color(25, 25, 25));
    if(mode === "game") {
        bullet_manager.update(delta_time);
        ship_manager.update(delta_time, bullet_manager, asteroid_manager);
        asteroid_manager.update(delta_time, bullet_manager, ship_manager);
        // powerUp_manager.update(bullet_manager, ship_manager);

        if(ship_manager.players.length)
            renderer.camera.move_softly(ship_manager.players[0].position, bounds);
    } else if(mode === "intro") {
        if(keyboard.getKey(keyboard.keys.space).down) mode = "fade out"
    } else if(mode === "fade out") {
        intro_timer += delta_time;

        renderer.camera.real_position = vec2.lerpf(math.lerp_tweenIn, vec2.zero, ship_manager.players[0].position, (intro_timer / intro_end_time));
        renderer.camera.position = vec2.add(renderer.camera.real_position, renderer.camera.shake_position);
        renderer.zoom = math.lerp_tweenIn(1, game_zoom, (intro_timer / intro_end_time))

        if(intro_timer >= intro_end_time) mode = "game";
    }
}

async function render(delta_time) {
    // Render the background
    if(mode === "game" || mode === "fade out") {

        bullet_manager.draw();
        ship_manager.draw();
        asteroid_manager.draw();
    } else if(mode === "intro") {
        asteroid_manager.draw();
        drawIntroText(color.white, 1, ship_manager);
    } 
    if(mode === "fade out") {
        asteroid_manager.draw();
        drawIntroText(color.white, 0, ship_manager);
    }
}

function drawIntroText(c, draw_ship = 1, ship_manager) {
    c.a = math.lerp(1, 0, (intro_timer / intro_end_time));
    renderer.fillColor = color.none;
    renderer.strokeColor = c;
    renderer.strokeWeight = 5;

    let width = 60;
    let height = 66.7;
    let padding_x = 10;
    let padding_y = 20;

    let start_position = vec2.create(-(width * 8 + padding_x * 9 + ship_manager.players[0].ship_size * 1.5 + ship_manager.enemies[0].ship_size * 1.5) / 2, renderer.height / 4)
    let position = start_position.clone();
    
    drawString('SP', false, start_position, position, width, height, padding_x, padding_y);
    let ship_size = ship_manager.players[0].ship_size;
    position.x += ship_size * 3/4;
    
    let pos = vec2.add(position, 0, ship_size * 2/3);
    if(draw_ship) {
        let shape = new Polygon(pos, Math.PI / 2, [vec2.create(ship_size, 0),
            vec2.create(-ship_size * 2/3, ship_size * 3/4),
            vec2.create(-ship_size * 2/3, -ship_size * 3/4)]);
            shape.draw();
    }        
    ship_manager.players[0].position = pos.clone();
    ship_manager.players[0].shape.position = ship_manager.players[0].position;
    ship_manager.players[0].shape.update();

    position.x += ship_size * 3/4 + padding_x;

    drawString('CE ', false, start_position, position, width, height, padding_x, padding_y);
    drawChar('W', position, width, height, padding_x);
    ship_size = ship_manager.enemies[0].ship_size;
    position.x += ship_size * 3/4;
    
    pos = vec2.add(position, 0, ship_size * 2/3);
    if(draw_ship) {
        let shape = new Polygon(pos, Math.PI / 2, [vec2.create(ship_size, 0),
            vec2.create(-ship_size * 2/3, ship_size * 3/4),
            vec2.create(-ship_size * 2/3, -ship_size * 3/4)]);
            shape.draw();
    }
    ship_manager.enemies[0].position = pos.clone();
    ship_manager.enemies[0].shape.position = ship_manager.enemies[0].position;
    ship_manager.enemies[0].shape.update();
    ship_manager.update_qtree();
    
    position.x += ship_size * 3/4 + padding_x;
    drawString('RS', false, start_position, position, width, height, padding_x, padding_y);

    if(draw_ship) {
        let state = (Math.sin(timer * 15) + 1) / 2 + 0.25;
        renderer.strokeColor = color.create(255, 255, 255, state / 2)
        renderer.strokeWeight = 2.5;
        drawString('PRESS SPACE', true, vec2.zero, vec2.zero, 30, 33.3, 5, 0)
        
        renderer.strokeColor = color.create((Math.sin(timer + (Math.PI/3*2)) + 1) / 2 * 255, (Math.cos(timer + (Math.PI/3*4)) + 1) / 2 * 255, (Math.sin(timer + (Math.PI/3*6)) + 1) / 2 * 255, 1)
        drawString('HAPPY BIRTHDAY JOHN', false, vec2.zero, vec2.create(-renderer.width / 2 + 25, -renderer.height / 2 + 25), 30, 33.3, 5, 0)
    }
}

function drawString(str, center, start_position, position, width, height, padding_x, padding_y) {
    if(center) {
        start_position.x -= ((width * str.length) + (padding_x * str.length - 1)) / 2;
        position.x -= ((width * str.length) + (padding_x * str.length - 1)) / 2;
        position.y = start_position.y;
    }
    for(let i = 0; i < str.length; i++) {
        let c = str[i];

        if(c == '\\') {
            i++
            c = str[i];

            switch(c) {
                case 'n': {
                    position.x = start_position.x;
                    position.y -= height + padding_y
                } break;
            }

            continue;
        }

        drawChar(c, position, width, height, padding_x);
    }
}

function drawChar(char, position, width, height, padding) {
    switch(char) {
        case 'A': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));

            position.x += width + padding;
        } break;
        case 'B': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, (height - height / 1.25)), vec2.add(position, width, height / 1.25));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width / 1.25, height));
            renderer.line(vec2.add(position, width / 1.25, height), vec2.add(position, width, height / 1.25));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width / 1.25, 0));
            renderer.line(vec2.add(position, width / 1.25, 0), vec2.add(position, width, (height - height / 1.25)));

            position.x += width + padding;
        } break;
        case 'C': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case 'D': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, (height - height / 1.25)), vec2.add(position, width, height / 1.25));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width / 1.25, height));
            renderer.line(vec2.add(position, width / 1.25, height), vec2.add(position, width, height / 1.25));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width / 1.25, 0));
            renderer.line(vec2.add(position, width / 1.25, 0), vec2.add(position, width, (height - height / 1.25)));

            position.x += width + padding;
        } break;
        case 'E': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));

            position.x += width + padding;
        } break;
        case 'F': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));

            position.x += width + padding;
        } break;
        case 'G': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height / 2));
            renderer.line(vec2.add(position, width, height / 2), vec2.add(position, width / 2, height / 2));

            position.x += width + padding;
        } break;
        case 'H': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));

            position.x += width + padding;
        } break;
        case 'I': {
            renderer.line(vec2.add(position, width / 2, 0), vec2.add(position, width / 2, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case 'J': {
            renderer.line(vec2.add(position, width / 2, 0), vec2.add(position, width / 2, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width / 2, 0));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height / 4));

            position.x += width + padding;
        } break;
        case 'K': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case 'L': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case 'M': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, width / 2, height), vec2.add(position, width / 2, height / 2));

            position.x += width + padding;
        } break;
        case 'N': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case 'O': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case 'P': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, height / 2), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));

            position.x += width + padding;
        } break;
        case 'Q': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width / 2, height / 2));

            position.x += width + padding;
        } break;
        case 'R': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, height / 2), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, 0));


            position.x += width + padding;
        } break;
        case 'S': {
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height / 2));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));
            renderer.line(vec2.add(position, 0, height / 2), vec2.add(position, width, height / 2));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));


            position.x += width + padding;
        } break;
        case 'T': {
            renderer.line(vec2.add(position, width / 2, 0), vec2.add(position, width / 2, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));

            position.x += width + padding;
        } break;
        case 'U': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case 'V': {
            renderer.line(vec2.add(position, width / 2, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width / 2, 0), vec2.add(position, width, height));

            position.x += width + padding;
        } break;
        case 'W': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));
            renderer.line(vec2.add(position, width / 2, 0), vec2.add(position, width / 2, height / 2));

            position.x += width + padding;
        } break;
        case 'X': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case 'Y': {
            renderer.line(vec2.add(position, width / 2, 0), vec2.add(position, width / 2, height / 2));
            renderer.line(vec2.add(position, width / 2, height / 2), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width / 2, height / 2), vec2.add(position, width, height));

            position.x += width + padding;
        } break;
        case 'Z': {
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, height));
            
            position.x += width + padding;
        } break;
        case ' ': {
            position.x += width + padding;
        } break;
        case '.': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, 0));

            position.x += width + padding;
        } break;
        case ',': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, -width / 4, -height / 4));

            position.x += width + padding;
        } break;
        case '_': {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));

            position.x += width + padding;
        } break;
        case '-': {
            renderer.line(vec2.add(position, width * 0.25, height / 2), vec2.add(position, width / 1.5, height / 2));

            position.x += width + padding;
        } break;
        default: {
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, 0, height));
            renderer.line(vec2.add(position, width, 0), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, height));
            renderer.line(vec2.add(position, 0, 0), vec2.add(position, width, 0));
            renderer.line(vec2.add(position, 0, height), vec2.add(position, width, 0));
            renderer.line(vec2.add(position, width, height), vec2.add(position, 0, 0));

            position.x += width + padding;
        } break;
    }
}