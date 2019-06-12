const Eat = require('./entities/Eat');
const Empty = require('./entities/Empty');
const Poison = require('./entities/Poison');
const Wall = require('./entities/Wall');

const Extra = require('./Extra');

var classic_chanses = {
    70: Eat,
    0: Empty,
    10: Poison,
    10: Wall,
}


var Map = {
    max_x: 511,
    max_y: 128,
    map: [],
    generate() {
        this.map = new Array(this.max_x);
        for (let x = 0; x < this.max_x; x++) {
            this.map[x] = new Array(this.max_y);
            for (let y = 0; y < this.max_y; y++) {
                this.createStructure(x,y,classic_chanses);
            }
        }
    },
    createStructure(x,y,chases){
        this.map[x][y] = new (this.randomGenStruc(chases))(x, y);
    },
    randomGenStruc(chanses) {
        matrix = [];
        for (let chanse in chanses) {
            for (let i = 0; i < chanse; i++) {
                matrix.push(chanses[chanse]);
            }
        }
        matrix.sort(() => Math.random() - 0.5);
        return matrix[Extra.random(0, matrix.length)];
    }  
}

if(global.map == undefined){
    global.map = Map;
    Map.generate()
}

module.exports = global.map;