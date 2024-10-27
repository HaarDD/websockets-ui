import WebSocket from 'ws';
import { WebSocketRoutes } from './server/routes/Routes';
import dotenv from 'dotenv';
import { generateUniqueIndex as generateIndex } from './server/utils/GenerationUtils';

dotenv.config();

const PORT = process.env.PORT || 3000;

const wss = new WebSocket.Server({ port: Number(PORT) });
const wsRoutes = new WebSocketRoutes();

const clients: { [key: string]: WebSocket } = {};

wss.on('connection', (ws) => {

    const clientIndex = generateIndex();
    clients[clientIndex] = ws;

    ws.on('message', (message) => {
        wsRoutes.handleMessage(clientIndex, message.toString());
    });

    ws.on('close', () => {
        delete clients[clientIndex];
    });
});


export function broadcastMessage(message: string) {
    for (const clientIndex in clients) {
        sendMessage(clients[clientIndex] as WebSocket, message);
    }
}

export function unicastMessage(clientIndex: string, message: string) {
    sendMessage(clients[clientIndex] as WebSocket, message);
}

function sendMessage(client: WebSocket, message: string) {
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(message);
    }
}

// eslint-disable-next-line no-console
console.log(`WebSocket server started on ws://localhost:${PORT}`);