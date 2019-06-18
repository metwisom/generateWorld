const Extra = require(`./Extra`);
const Map = require(`./Map`);

const Eat = require(`./entities/Eat`);
const Empty = require(`./entities/Empty`);
const Poison = require(`./entities/Poison`);
const Wall = require(`./entities/Wall`);


var Bot = class {
    constructor(genom, rand) {
        this.has_block
        this.angle = 0;
        this.react = 2;
        this.is_dead = false;
        this.pos = [Extra.random(0, Map.max_x), Extra.random(0, Map.max_y)];
        this.life = 50;
        this.current_step = 0;
        this.genom = new Array(64);
        if (genom != undefined) {
            this.genom = genom;
        } else {
            for (let i = 0; i < 64; i++) {
                this.genom[i] = Extra.random(0, 64);
            }
        }
        if (rand) {
            this.genom[Extra.random(0, 64)] = Extra.random(0, 64);
        }
    }
    action() {
        let gone = true;
        while (gone) {
            let bit = this.genom[this.current_step];
            let new_steps = 0;
            if (bit <= 7) {
                new_steps = this.move(bit % 8);
                gone = false;
            } else if (bit <= 15) {
                new_steps = this.see(bit % 8);
            } else if (bit <= 23) {
                new_steps = this.take(bit % 8);
                gone = false;
            } else if (bit <= 31) {
                new_steps = this.fuck(bit % 8);
                gone = false;
            } else if (bit <= 39) {
                new_steps = this.rotate(bit % 8);
            } else if (bit >= 8) {
                new_steps += bit % 8 + 1;
                gone = false;
            }
            this.current_step += new_steps;
            if (this.current_step >= 64) {
                this.current_step -= 64;
            }
        }
        if (Map.map[this.pos[0]][this.pos[1]] instanceof Eat) {
            this.life += Map.map[this.pos[0]][this.pos[1]].capacity;
            if(this.life > 150){
                this.life = 100;
            }
            Map.map[this.pos[0]][this.pos[1]] = new Empty(this.pos[0], this.pos[1]);

        }
        this.life--;
        if (Map.map[this.pos[0]][this.pos[1]] instanceof Poison || this.life == 0) {
            Map.map[this.pos[0]][this.pos[1]] = new Poison(this.pos[0], this.pos[1]);
            this.is_dead = true;
            delete global.bots.bots[global.bots.bots.indexOf(this)];
        }
    }
    rotate(dir) {
        this.angle = (this.angle + dir) % 4;
        return dir + 1;
    }
    move(dir) {
        let nx = this.pos[0];
        let ny = this.pos[1];
        if (dir <= 2) {
            ny -= Math.round(Math.sin(Math.PI / 2 * this.angle));
        }
        if (dir >= 4 && dir <= 6) {
            ny += Math.round(Math.sin(Math.PI / 2 * this.angle));
        }
        if (dir >= 2 && dir <= 4) {
            nx += Math.round(Math.cos(Math.PI / 2 * this.angle));;
        }
        if (dir == 0 || dir >= 6) {
            nx -= Math.round(Math.cos(Math.PI / 2 * this.angle));;
        }
        if (nx >= Map.max_x) {
            nx = 0
        }
        if (nx < 0) {
            nx = Map.max_x - 1
        }
        if (ny >= Map.max_y) {
            ny = 0
        }
        if (ny < 0) {
            ny = Map.max_y - 1
        }
        if (nx >= 0 && nx < Map.max_x && ny >= 0 && ny < Map.max_y && !(Map.map[nx][ny] instanceof Wall)) {
            this.pos = [nx, ny];
            return Map.map[nx][ny].reaction;
        }
        if (nx >= 0 && nx < Map.max_x && ny >= 0 && ny < Map.max_y) {
            return Map.map[nx][ny].reaction;
        }
        return 4;
    }
    see(dir) {
        let nx = this.pos[0];
        let ny = this.pos[1];
        if (dir <= 2) {
            ny -= Math.round(Math.sin(Math.PI / 2 * this.angle));
        }
        if (dir >= 4 && dir <= 6) {
            ny += Math.round(Math.sin(Math.PI / 2 * this.angle));
        }
        if (dir >= 2 && dir <= 4) {
            nx += Math.round(Math.cos(Math.PI / 2 * this.angle));;
        }
        if (dir == 0 || dir >= 6) {
            nx -= Math.round(Math.cos(Math.PI / 2 * this.angle));;
        }
        if (nx >= Map.max_x) {
            nx = 0
        }
        if (nx < 0) {
            nx = Map.max_x - 1
        }
        if (ny >= Map.max_y) {
            ny = 0
        }
        if (ny < 0) {
            ny = Map.max_y - 1
        }
        if (nx >= 0 && nx < Map.max_x && ny >= 0 && ny < Map.max_y) {
            return Map.map[nx][ny].reaction;
        }
        return 4;
    }
    fuck(dir) {
        let nx = this.pos[0];
        let ny = this.pos[1];
        if (dir <= 2) {
            ny -= Math.round(Math.sin(Math.PI / 2 * this.angle));
        }
        if (dir >= 4 && dir <= 6) {
            ny += Math.round(Math.sin(Math.PI / 2 * this.angle));
        }
        if (dir >= 2 && dir <= 4) {
            nx += Math.round(Math.cos(Math.PI / 2 * this.angle));;
        }
        if (dir == 0 || dir >= 6) {
            nx -= Math.round(Math.cos(Math.PI / 2 * this.angle));;
        }
        if (nx >= Map.max_x) {
            nx = 0
        }
        if (nx < 0) {
            nx = Map.max_x - 1
        }
        if (ny >= Map.max_y) {
            ny = 0
        }
        if (ny < 0) {
            ny = Map.max_y - 1
        }
        if (global.bots.bots == undefined) {
            return 1;
        }
        let dist = function (x1, y1, x2, y2) {
            let a = x1 - x2;
            let b = y1 - y2;

            let c = Math.sqrt(a * a + b * b);
            return c;
        }
        let bots = global.bots.bots.filter(e =>  dist(e.pos[0], e.pos[1], nx, ny) < 1.5)
        if (bots[0] != undefined) {
            if (bots[0].life > 100 && this.life > 100) {
                bots[0].life /= 2;
                this.life /= 2;
                let new_genom = bots[0].genom.slice(0);
                for (let i = 0; i < new_genom.length; i += 2) {
                    new_genom[i] = this.genom[i];
                }
                let child = new Bot(new_genom);
                child.pos = this.pos
                global.bots.bots.push(child);
            }
        }
        return 5;
    }
    take(dir) {
        let nx = this.pos[0];
        let ny = this.pos[1];
        if (dir <= 2) {
            ny -= Math.round(Math.sin(Math.PI / 2 * this.angle));
        }
        if (dir >= 4 && dir <= 6) {
            ny += Math.round(Math.sin(Math.PI / 2 * this.angle));
        }
        if (dir >= 2 && dir <= 4) {
            nx += Math.round(Math.cos(Math.PI / 2 * this.angle));;
        }
        if (dir == 0 || dir >= 6) {
            nx -= Math.round(Math.cos(Math.PI / 2 * this.angle));;
        }
        if (nx >= Map.max_x) {
            nx = 0
        }
        if (nx < 0) {
            nx = Map.max_x - 1
        }
        if (ny >= Map.max_y) {
            ny = 0
        }
        if (ny < 0) {
            ny = Map.max_y - 1
        }
        if (nx >= 0 && nx < Map.max_x && ny >= 0 && ny < Map.max_y) {
            if (Map.map[nx][ny] instanceof Poison) {
                global.map.createStructure(nx, ny, [{ type: Eat, chance: 1 }]);
                let value = Map.map[nx][ny].reaction;
                this.life += Map.map[nx][ny].capacity;
                global.map.createStructure(nx, ny, [{ type: Empty, chance: 1 }]);
                return value;
            }
            return Map.map[nx][ny].reaction;
        }
        return 4;
    }

};

module.exports = Bot;