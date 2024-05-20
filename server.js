const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8080 });

let players = [];

server.on('connection', socket => {
    console.log('Un joueur est connecté');
    
    socket.on('message', message => {
        const data = JSON.parse(message);
        if (data.type === 'name') {
            socket.playerName = data.name;
            players.push(socket);
            
            if (players.length === 2) {
                players.forEach((player, index) => {
                    const opponentName = players[(index + 1) % 2].playerName;
                    player.send(JSON.stringify({ type: 'start', player: index + 1, opponent: opponentName }));
                });
                players = [];
            }
        } else if (data.type === 'update') {
            players.forEach(player => {
                if (player !== socket) {
                    player.send(message);
                }
            });
        }
    });

    socket.on('close', () => {
        console.log('Un joueur est déconnecté');
        players = players.filter(player => player !== socket);
    });
});

console.log('Serveur WebSocket en écoute sur ws://localhost:8080');
