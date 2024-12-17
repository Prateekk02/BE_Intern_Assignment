import fs from "fs"
import readline from 'readline'


const filePath = './log.txt';
let fileOffset = 0;
export const getLast10Lines = async () =>{
    const lines = [];
    const stream = fs.createReadStream(filePath);
    const rl =readline.createInterface({input: stream});

    for await (const line of rl){
        lines.push(line);
        if(lines.length > 10)
            lines.shift();
    }

    return lines
}


export const watchFile = (onUpdate:any) =>{
    fs.watch(filePath, (eventType) =>{
        if(eventType === 'change'){
            const stream = fs.createReadStream(filePath, {start: fileOffset});
            stream.on('data', (part) =>{
                fileOffset += part.length;
                const updates = part.toString().split('\n').filter(Boolean)
                updates.forEach(onUpdate);
            });
        }
    });
} 

