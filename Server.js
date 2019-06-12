const Map = require('./Map');
const Bots = require('./Bots')

var server = {
    start() {
        const WebSocket = require('ws');
        const wss = new WebSocket.Server({ port: 8080 });
        wss.on('connection', function connection(ws) {
            let a = setInterval(() => {
                let send_bots = Bots.bots.filter(e => e).map(e => e.pos);
                let send_map = Map.map.map(e => e.map(t => t.reaction))
                ws.send(JSON.stringify([send_map, send_bots]))
            }, 1);
            ws.on('close', () => clearInterval(a));
        });
    }
}

if(global.server == undefined){
    global.server = server;
    server.start();
}

module.exports = global.server;