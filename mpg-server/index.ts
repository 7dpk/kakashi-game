// Path: index.ts

import { WebSocketServer } from 'ws';
import http from 'http'

const wss = new WebSocketServer({
    port: 8080
})

interface message {
    type: string,
    player: {
        id: string,
        x: number,
        y: number,
        rotation: number
    }
}

wss.on('connection', (ws) => {
    ws.on('message', (msg) => { 
        console.log('received: %s', msg)
        const parsedMessage = JSON.parse(msg.toString()) as message
        if (parsedMessage.type == 'playerMoved') {
            wss.clients.forEach(client => {
                if (client != ws) {
                    client.send(JSON.stringify(parsedMessage))
                }
            })
        } else if (parsedMessage.type == 'playerJoined') {
            wss.clients.forEach(client => {
                if (client != ws) {
                    client.send(JSON.stringify(parsedMessage))
                }
            })
        } else if (parsedMessage.type == 'playerShot') {
            wss.clients.forEach(client => {
                if (client != ws) {
                    client.send(JSON.stringify(parsedMessage))
                }
            })
        }
    })
})

