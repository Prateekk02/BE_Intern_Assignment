"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const ws_1 = __importDefault(require("ws"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const fileWatcher_1 = require("./services/fileWatcher");
const broadcast_1 = require("./services/broadcast");
const PORT = 8080;
const server = http_1.default.createServer((req, res) => {
    if (req.url === "/log") {
        const filePath = path_1.default.join(__dirname, "public", "index.html");
        fs_1.default.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Internal Server Error");
                return;
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    }
    else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
    }
});
const wss = new ws_1.default.Server({ server });
wss.on('connection', (ws) => {
    console.log('Client connected');
    (0, broadcast_1.addClient)(ws);
    (0, fileWatcher_1.getLast10Lines)().then((lines) => {
        ws.send(JSON.stringify({ type: 'init', data: lines }));
    });
    ws.on('close', () => {
        console.log("Client Disconnected");
        (0, broadcast_1.removeClient)(ws);
    });
});
(0, fileWatcher_1.watchFile)((line) => {
    (0, broadcast_1.broadcast)({ type: 'update', data: line });
});
server.listen(PORT, () => {
    console.log("Server connected to port: ", PORT);
});
