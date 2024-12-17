const clients = new Set();
export const addClient = (ws) => clients.add(ws);

export const removeClient = (ws) => clients.delete(ws);
export const broadcast = (message) =>{
    const data = JSON.stringify(message);
    clients.forEach((client) =>{
        if(clients.readyState === 1){
            client.send(data);
        }
    });
}