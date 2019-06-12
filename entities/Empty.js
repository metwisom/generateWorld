const Eat = require('./Eat');
const Poison = require('./Poison');
const Events = require('../Events');

const Extra = require('../Extra');

module.exports = class {
    constructor(x, y) {
        this.reaction = 2;
        let action = () => {
            global.map.createStructure(x, y, { 50: Eat, 5: Poison, })
        }
        Events.addEvent(action,Extra.random(100,3000))
    }
};