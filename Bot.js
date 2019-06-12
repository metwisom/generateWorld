const Bots = require('./Bots');
const Extra = require('./Extra');
const Map = require('./Map');

const Eat = require('./entities/Eat');
const Empty = require('./entities/Empty');
const Poison = require('./entities/Poison');
const Wall = require('./entities/Wall');


module.exports = class {
    constructor(genom, rand) {
        this.react = 2;
        this.is_dead = false;
        this.pos = [Extra.random(0, Map.max_x), Extra.random(0, Map.max_y)];
        this.life = 100;
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
        let bit = this.genom[this.current_step];
        let new_steps = 0;
        if (bit <= 7) {
            new_steps = this.move(bit);
        } else if (bit <= 15) {
            new_steps = this.see(bit - 8);
        } else if (bit <= 23) {
            new_steps = this.take(bit - 16);
        } else if (bit >= 8) {
            new_steps += bit % 5;
        }
        if (Map.map[this.pos[0]][this.pos[1]] instanceof Eat) {
            Map.map[this.pos[0]][this.pos[1]] = new Empty(this.pos[0], this.pos[1]);
            this.life += 20;
        }
        this.life--;
        if (Map.map[this.pos[0]][this.pos[1]] instanceof Poison || this.life == 0) {
            Map.map[this.pos[0]][this.pos[1]] = new Empty(this.pos[0], this.pos[1]);
            this.is_dead = true;
            delete global.bots.bots[global.bots.bots.indexOf(this)];
        }
        this.current_step += new_steps;
        if (this.current_step >= 64) {
            this.current_step -= 64;
        }
    }
    move(dir) {
        let nx = this.pos[0];
        let ny = this.pos[1];
        if (dir <= 2) {
            ny--;
        }
        if (dir >= 4 && dir <= 6) {
            ny++;
        }
        if (dir >= 2 && dir <= 4) {
            nx++;
        }
        if (dir == 0 || dir >= 6) {
            nx--;
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
            ny--;
        }
        if (dir >= 4 && dir <= 6) {
            ny++;
        }
        if (dir >= 2 && dir <= 4) {
            nx++;
        }
        if (dir == 0 || dir >= 6) {
            nx--;
        }
        if (nx >= 0 && nx < Map.max_x && ny >= 0 && ny < Map.max_y) {
            return Map.map[nx][ny].reaction;
        }
        return 4;
    }
    take(dir) {
        let nx = this.pos[0];
        let ny = this.pos[1];
        if (dir <= 2) {
            ny--;
        }
        if (dir >= 4 && dir <= 6) {
            ny++;
        }
        if (dir >= 2 && dir <= 4) {
            nx++;
        }
        if (dir == 0 || dir >= 6) {
            nx--;
        }
        if (nx >= 0 && nx < Map.max_x && ny >= 0 && ny < Map.max_y) {
            if (Map.map[nx][ny] instanceof Poison) {
                global.map.createStructure(nx, ny, [{ type: Eat, chance: 1 }]);
                let value = Map.map[nx][ny].reaction;
                global.map.createStructure(nx, ny, [{ type: Empty, chance: 1 }]);
                return value;
            }
            return Map.map[nx][ny].reaction;
        }
        return 4;
    }

}

