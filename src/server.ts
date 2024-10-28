/* eslint-disable no-console */
// src\server.ts

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
        console.log('---------- RESULT (INCOMING MESSAGE) START ---------');
        console.log(message.toString());
        console.log('---------- RESULT (INCOMING MESSAGE) END ---------\n');
    });

    ws.on('close', () => {
        wsRoutes.handleClose(clientIndex);
        delete clients[clientIndex];
        console.log(`---------- RESULT (DISCONNECT, CLIENT ${clientIndex}) START ---------\n`);
    });
});


export function broadcastMessage(message: string) {
    for (const clientIndex in clients) {
        sendMessage(clients[clientIndex] as WebSocket, message);
    }
    console.log('---------- RESULT (OUTCOMING MESSAGE, BROADCAST) START ---------');
    console.log(message.toString());
    console.log('---------- RESULT (OUTCOMING MESSAGE) END ---------\n');
}

export function unicastMessage(clientIndex: string, message: string) {
    sendMessage(clients[clientIndex] as WebSocket, message);
    console.log(`---------- RESULT (OUTCOMING MESSAGE, UNICAST TO ${clientIndex}) START ---------`);
    console.log(message.toString());
    console.log('---------- RESULT (OUTCOMING MESSAGE) END ---------\n');
}

function sendMessage(client: WebSocket, message: string) {
    if (client && client.readyState === WebSocket.OPEN) {
        client.send(message);
    }
}

// eslint-disable-next-line no-console
console.log(`WebSocket server started on ws://localhost:${PORT}`);