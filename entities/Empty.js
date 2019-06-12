const Eat = require('./Eat');
const Poison = require('./Poison');
const Events = require('../Events');

const Extra = require('../Extra');

module.exports = class {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.reaction = 2;
        let action = () => {
            global.map.createStructure(x, y, [{ type: Eat, chance: 50 }, { type: Poison, chance: 5 }]);
        }
        Events.addEvent(action, Extra.random(100, 3000));
    }
};