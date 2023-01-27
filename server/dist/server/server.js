'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocket = __importStar(require("ws"));
const http = __importStar(require("http"));
const queries_1 = require("./queries");
const express = require('express');
const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.WebSocketServer({ server });
const clients = {};
wss.on('connection', (ws) => {
    ws.on('message', (buffer) => __awaiter(void 0, void 0, void 0, function* () {
        const data = JSON.parse(buffer.toString());
        clients[data.name] = ws;
        switch (data.type) {
            case "login":
                const messages = yield (0, queries_1.getMessages)(data.name);
                const users = yield (0, queries_1.getUsers)();
                const errors = [messages.error, users.error];
                const currentUser = users.users.find(user => user.name === data.name);
                if (!currentUser && !messages.error && !users.error) {
                    const newUser = yield (0, queries_1.addUser)(data.name);
                    if (newUser.error)
                        errors.push(newUser.error);
                    if (newUser.user) {
                        users.users.push(newUser.user);
                        wss.clients.forEach(client => client.send(JSON.stringify({ type: 'add_user', users })));
                    }
                }
                ws.send(JSON.stringify({
                    name: data.name,
                    users: users.users,
                    messages: messages.messages,
                    type: "login",
                    error: errors.filter(error => error)
                }));
                break;
            case 'message':
                const message = yield (0, queries_1.saveMessage)(data.message);
                const recipient = clients[data.message.recipient];
                const sendData = JSON.stringify({
                    message: message.message,
                    type: 'message',
                    error: [message.error].filter(error => error)
                });
                if (recipient)
                    recipient.send(sendData);
                ws.send(sendData);
                break;
        }
    }));
    ws.on('close', () => {
        for (let clientName in clients) {
            if (clients[clientName] === ws)
                delete clients[clientName];
        }
    });
    ws.on('error', () => {
        console.log('ERROR CLOSE');
        for (let clientName in clients) {
            if (clients[clientName] === ws)
                delete clients[clientName];
        }
        ws.close();
    });
});
server.listen(PORT, () => {
    console.log(`App listen on port ${PORT}...`);
});
