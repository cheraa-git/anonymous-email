export interface IMessage {
  id: string
  author: string
  recipient: string
  title: string
  text: string
  timestamp: string
}

export interface IUser {
  id: string
  name: string
}

interface SocketLogin {
  type: 'login'
  messages: IMessage[]
  name: string
  users: IUser[]
  error: string[]
}

interface SocketMessage {
  type: 'message'
  message: IMessage
  name: string
  error: string[]
}

interface SocketAddUser {
  type: 'add_user'
  users: IUser[]
  error: string[]
}


export type SocketDataServet = SocketLogin | SocketMessage
export type SocketDataClient = SocketLogin | SocketMessage | SocketAddUser
