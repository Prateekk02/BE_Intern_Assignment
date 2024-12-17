import http from "http"
import WebSocket from "ws"
import path from 'path'
import fs from "fs"
import { watchFile, getLast10Lines } from "./services/fileWatcher";
import { broadcast, addClient, removeClient } from "./services/broadcast";



const PORT = 8080
const server = http.createServer((req,res) =>{
    
    if (req.url === "/log") {
        const filePath = path.join(__dirname, "public","index.html");
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Internal Server Error");
            return;
          }
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(data);
        });
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      }
});

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



