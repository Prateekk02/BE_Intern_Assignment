import http from "http"
import WebSocket from "ws"
import { watchFile, getLast10Lines } from "./src/services/fileWatcher";
import { broadcast, addClient, removeClient } from "./src/services/broadcast";



const PORT = 8080
const server = http.createServer();

const wss = new WebSocket.Server({server});

wss.on('connection', (ws) =>{
    console.log('Client connected')
    addClient(ws)
    
    getLast10Lines().then(lines) =>{
        ws.send(JSON.stringify({type:'init' , data:lines}))
    }

    wss.on('close', () =>{
        console.log("Client Disconnected");
        removeClient(ws); 
    });    
});

watchFile((line) =>{
    broadcast({type:'update', data: line});

});

server.listen(PORT, () =>{
    console.log("Server connected to port: ", PORT);
})



