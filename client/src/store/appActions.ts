import { AppDispatch, RootState } from "./store"
import { addMessage, logout, setConnection, setError, setLoading, setMessages, setName, setUsers } from "./appSlices"
import { IMessage, SocketDataClient } from "../../../types"

export const connect = (name: string) => (dispatch: AppDispatch) => {
  const connection = new WebSocket(process.env.REACT_APP_SERVER_URL + '')
  connection.onopen = () => {
    dispatch(setConnection(connection))
    connection.send(JSON.stringify({ type: 'login', name }))
    dispatch(setLoading(true))
    dispatch(setError(''))
    console.log('Connected')
  }
  connection.onmessage = (event) => {
    const data = JSON.parse(event.data) as SocketDataClient
    if (data.error && data.error.length > 0) {
      console.log(data.error)
      connection.close()
      dispatch(setError('Connection error'))
    }

    switch (data.type) {
      case "login":
        dispatch(setName(data.name))
        dispatch(setMessages(data.messages))
        dispatch(setUsers(data.users))
        localStorage.setItem('name', data.name)
        dispatch(setLoading(false))
        break
      case "message":
        dispatch(addMessage(data.message))
        dispatch(setLoading(false))
        break
      case "add_user":
        dispatch(setUsers(data.users))
        console.log('ADD USER')
    }
  }
  connection.onclose = () => {
    dispatch(logout())
    console.log('Connection close')
  }

  connection.onerror = () => {
    dispatch(logout())
    dispatch(setError('Connection error'))
  }
}

export const autoConnect = () => (dispatch: AppDispatch) => {
  const name = localStorage.getItem('name')
  if (name) {
    dispatch(connect(name))
  }
}

export const sendMessage = (data: Omit<IMessage, "id">) => (dispatch: AppDispatch, getState: () => RootState) => {
  const { connection, name } = getState().app
  dispatch(setLoading(true))
  const sentData = {
    type: "message",
    message: data,
    name
  }
  connection?.send(JSON.stringify(sentData))
}


