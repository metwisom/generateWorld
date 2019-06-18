const Eat = require(`./entities/Eat`);
const Empty = require(`./entities/Empty`);
const Poison = require(`./entities/Poison`);
const Wall = require(`./entities/Wall`);

const Extra = require(`./Extra`);


var classic_chances = [
    { type: Eat, chance: 50 },
    { type: Empty, chance: 0 },
    { type: Poison, chance: 1 },
    { type: Wall, chance: 10 },
];

var WorldMap = {
    max_x: 511,
    max_y: 128,
    map: [],
    generate() {
        this.map = [];
        for (let x = this.max_x; x--;) {
            this.map[x] = [];
            for (let y = this.max_y; y--;) {
                this.map[x][y] = this.createStructure(x, y, classic_chances);

            }
        }
    },
    createStructure(x, y, chance) {
        let a = this.randomGenStruc(chance);
        return (this.map[x][y] = new a(x, y));
    },
    randomGenStruc(chances) {
        let matrix = [];
        for (let i in chances) {
            let item = chances[i];
            matrix = matrix.concat(new Array(item.chance).fill(item.type, 0));
        }
        matrix.sort(() => Math.random() - 0.5);
        let rand = Extra.random(0, matrix.length);
        return matrix[rand];
    }
};

if (global.map == undefined) {
    global.map = WorldMap;
    WorldMap.generate();
}

module.exports = global.map;