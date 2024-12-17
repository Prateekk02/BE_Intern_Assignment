import http from "http"
import WebSocket from "ws"

import { watchFile, getLast10Lines } from "./services/fileWatcher";
import { broadcast, addClient, removeClient } from "./services/broadcast";



const PORT = 8080
const server = http.createServer();

const wss = new WebSocket.Server({server});

wss.on('connection', (ws) =>{
    console.log('Client connected')
    addClient(ws);
    
    getLast10Lines().then((lines) =>{
        ws.send(JSON.stringify({type:'init' , data:lines}));
    });

    ws.on('close', () =>{
        console.log("Client Disconnected");
        removeClient(ws); 
    });    
});

watchFile((line:any) =>{
    broadcast({type:'update', data: line});
});

server.listen(PORT, () =>{
    console.log("Server connected to port: ", PORT);
})



