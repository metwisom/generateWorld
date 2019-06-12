const Extra = require('../Extra');

module.exports = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.reaction = 1;
        this.capacity = Extra.random(20, 60);
    }
}