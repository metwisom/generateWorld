const Extra = require('../Extra');

module.exports = class {
    constructor(x, y) {
        this.reaction = 1;
        this.capacity = Extra.random(20, 60);
    }
}