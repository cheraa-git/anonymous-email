import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IMessage, IUser } from "../../../types"

export interface AppSlice {
  connection: WebSocket | null
  messages: IMessage[]
  name: string
  authError: string
  messageFilter: 'inbox' | 'sent'
  loading: boolean
  users: IUser[]
}

const initialState: AppSlice = {
  connection: null,
  messages: [],
  name: '',
  authError: '',
  messageFilter: 'inbox',
  loading: false,
  users: []
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setConnection: (state, { payload: socket }: PayloadAction<WebSocket>) => {
      state.connection = socket
    },
    setMessages: (state, { payload: messages }: PayloadAction<IMessage[]>) => {
      state.messages = messages
    },
    addMessage: (state, { payload: message }: PayloadAction<IMessage>) => {
      if (!state.messages.find(m => m.id === message.id)) {
        state.messages.push(message)
      }
    },
    setName: (state, { payload: name }: PayloadAction<string>) => {
      state.name = name
    },
    logout: state => {
      localStorage.removeItem('name')
      state.connection?.close()
      state.name = ''
      state.messages = []
      state.connection = null
      state.loading = false
    },
    setError: (state, { payload: error }: PayloadAction<string>) => {
      state.authError = error
    },
    setMessageFilter: (state, { payload: filter }: PayloadAction<'inbox' | 'sent'>) => {
      state.messageFilter = filter
    },
    setLoading: (state, { payload: loading }: PayloadAction<boolean>) => {
      state.loading = loading
    },
    setUsers: (state, { payload: users }: PayloadAction<IUser[]>) => {
      state.users = users
    },
  }
})

export const {
  setConnection,
  setMessages,
  setName,
  logout,
  setError,
  addMessage,
  setMessageFilter,
  setLoading,
  setUsers
} = appSlice.actions

export default appSlice.reducer
