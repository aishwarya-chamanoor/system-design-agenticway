const net = require('net')

const connections = []
let count = 0;

function openConnection() {
    const socket = new net.Socket();
    socket.connect(3000, '127.0.0.1', () =>{
        count++;
        if(count%100 == 0){
            console.log(`connections : ${count}`);
        }
        connections.push(socket);
        openConnection();
    });

    socket.on('error', (err) =>{
        console.log(`Failed at connnection #${count}: ${err.message} `);
        console.log('-----CEILING HIT-----');
    });
}

openConnection();