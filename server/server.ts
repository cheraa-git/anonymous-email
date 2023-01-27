'use strict'
import * as WebSocket from 'ws'
import { SocketDataServet } from "../types"
import * as http from 'http'
import { addUser, getMessages, getUsers, saveMessage } from "./queries"

const express = require('express')

const PORT = process.env.PORT || 8080
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.WebSocketServer({ server })

const clients: { [name: string]: WebSocket.WebSocket } = {}


wss.on('connection', (ws) => {
  ws.on('message', async (buffer) => {
    const data = JSON.parse(buffer.toString()) as SocketDataServet
    clients[data.name] = ws
    switch (data.type) {
      case "login":
        const messages = await getMessages(data.name)
        const users = await getUsers()
        const errors: (object | undefined)[] = [messages.error, users.error]
        const currentUser = users.users.find(user => user.name === data.name)
        if (!currentUser && !messages.error && !users.error) {
          const newUser = await addUser(data.name)
          if (newUser.error) errors.push(newUser.error)
          if (newUser.user) {
            users.users.push(newUser.user)
            wss.clients.forEach(client => client.send(JSON.stringify({ type: 'add_user', users })))
          }
        }
        ws.send(JSON.stringify({
          name: data.name,
          users: users.users,
          messages: messages.messages,
          type: "login",
          error: errors.filter(error => error)
        }))
        break

      case 'message':
        const message = await saveMessage(data.message)
        const recipient = clients[data.message.recipient]
        const sendData = JSON.stringify({
          message: message.message,
          type: 'message',
          error: [message.error].filter(error => error)
        })
        if (recipient) recipient.send(sendData)
        ws.send(sendData)
        break
    }
  })
  ws.on('close', () => {
    for (let clientName in clients) {
      if (clients[clientName] === ws) delete clients[clientName]
    }
  })
  ws.on('error', () => {
    console.log('ERROR CLOSE')
    for (let clientName in clients) {
      if (clients[clientName] === ws) delete clients[clientName]
    }
    ws.close()
  })

})


server.listen(PORT, () => {
  console.log(`App listen on port ${PORT}...`)
})
