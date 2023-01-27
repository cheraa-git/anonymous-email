import { FC } from "react"
import { Message } from "./Message"
import { RootState, useAppSelector } from "../store/store"

export const MessagesList:FC = () => {
  const { messages, messageFilter, name } = useAppSelector((state: RootState) => state.app)

  const filterMessages = messages.filter(message => {
    if (message.recipient === message.author) return true
    return messageFilter === 'inbox' ? message.author !== name : message.author === name
  })

  filterMessages.sort((a, b) => +b.timestamp - +a.timestamp)
  return (
    <div className="bg-white rounded mb-5">
      {filterMessages.map(message => (
        <Message key={message.id} message={message}/>
      ))}
      {filterMessages.length === 0 && <h1 className="p-5 text-center">Messages are missing...</h1>}
    </div>
  )
}
