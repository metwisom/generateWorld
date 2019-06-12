
const Bot = require('./Bot');
const Events = require('./Events');

var bots_count = 64


var bots = {
    generation: 0,
    saved_bots: [],
    bots: [],
    actions: 0,
    start() {
        for (let i = 0; i < bots_count; i++) {
            this.bots.push(new Bot());
        }
        setInterval(() => {
            for (let i = 999; i; i--){
                for (let i in this.bots) {
                    this.bots[i].action();
                    this.actions++;
                    if (this.bots.filter(e => e).length <= 8) {
                        this.saved_bots = [];
                        for (let i in this.bots) {
                            this.saved_bots.push(this.bots[i]);
                        }
                        this.createGenerate();
                        return;
                    }
                }
                Events.tick()
            }
        }, 1);
    },
    createGenerate() {
        this.bots = [];
        this.saved_bots.forEach(bot => {
            for (let i = 0; i < bots_count / 8; i++) {
                this.bots.push(new Bot(bot.genom.slice(0), i == bots_count / 8 - 1));
            }
        });
        this.saved_bots = [];
        this.generation++;
        console.log(this.actions);
        this.actions = 0;
    }
}

if (global.bots == undefined) {
    global.bots = bots;
    bots.start()
}


module.exports = global.bots;

