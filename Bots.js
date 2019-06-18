const Bot = require(`./Bot`);
const Events = require(`./Events`);
const sqlite = require(`./sqlite`);

const bots_count = 64;

class Bots {
    constructor() {
        this.generation = 0
        this.saved_bots = []
        this.bots = []
        this.actions = 0
    }
    async start() {
        await sqlite.query(`select * from t_bot`)
            .then(data => {
                if (data.length > 0) {
                    console.log(`Есть данные`);
                    for (let i in data) {
                        let bot = data[i];
                        for (let i = 0; i < bots_count / 8; i++) {
                            this.bots.push(new Bot(JSON.parse(bot.genom)));
                        }
                    }
                } else {
                    console.log(`Нет данных`);
                    for (let i = 0; i < bots_count; i++) {
                        this.bots.push(new Bot());
                    }
                }
            });
        setInterval(() => {
            for (let i = 9999; i; i--) {
                for (let i in this.bots) {
                    this.bots[i].action();
                    this.actions++;
                    if (this.bots.filter(e => e).length <= 8) {
                        this.saved_bots = [];
                        for (let i in this.bots) {
                            this.saved_bots.push(this.bots[i]);
                        }
                        this.createGenerate();

                        Events.clear();
                        return;
                    }
                }
                Events.tick();
            }
        }, 1);
    }
    async createGenerate() {
        this.bots = [];
        await sqlite.set(`DELETE FROM t_bot`);
        for (let i in this.saved_bots) {
            let bot = this.saved_bots[i];
            let genom = JSON.stringify(bot.genom);
            await sqlite.set(`INSERT INTO t_bot(genom) VALUES('${genom}')`);
        }
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
};

if (global.bots == undefined) {
    global.bots = new Bots();
    global.bots.start();
}


module.exports = global.bots;

