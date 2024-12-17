"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcast = exports.removeClient = exports.addClient = void 0;
const clients = new Set();
const addClient = (ws) => clients.add(ws);
exports.addClient = addClient;
const removeClient = (ws) => clients.delete(ws);
exports.removeClient = removeClient;
const broadcast = (message) => {
    const data = JSON.stringify(message);
    clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(data);
        }
    });
};
exports.broadcast = broadcast;
