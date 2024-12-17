const clients = new Set();
export const addClient = (ws:any) => clients.add(ws);

export const removeClient = (ws:any) => clients.delete(ws);
export const broadcast = (message:any) =>{
    const data = JSON.stringify(message);
    clients.forEach((client:any) =>{
        if(client.readyState === 1){
            client.send(data);
        }
    });
}