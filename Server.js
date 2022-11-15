const Map = require(`./Map`);
const Bots = require(`./Bots`);
const Eat = require(`./entities/Eat`);

var bot_for_send = { type: 'bot', data: [] }
var map_for_send = { type: 'map', data: [] };

function createData() {
    //console.log(Bots.bots)
    bot_for_send = Bots.bots.filter(e => e).map(e => e.pos);
    bot_for_send = { type: 'bot', data: bot_for_send }

    let send_map = [];
    Map.map.map(e => e.filter(e => !(e instanceof Eat)).map(t => send_map.push([t.x, t.y, t.reaction])));
    map_for_send = { type: 'map', data: send_map };
    setTimeout(() => createData(), 1)
}
createData();

const server = {
    start() {
        const WebSocket = require(`ws`);
        const wss = new WebSocket.Server({ port: 8765 });
        wss.on(`connection`, function connection(ws) {
            ws.on(`message`, (data) => {
                if (data == 'map') {
                    ws.send(JSON.stringify(map_for_send));
                }
                if (data == 'bot') {
                    //if(bot_for_send.data.length != 0)
                        ws.send(JSON.stringify(bot_for_send));
                }
            });
        });
    }
};

if (global.server == undefined) {
    global.server = server;
    server.start();
}

module.exports = global.server;