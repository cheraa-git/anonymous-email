import { IMessage, IUser } from "../types"

const db = require('./db')


export async function getMessages(name: string) {
  try {
    const response = await db.query('SELECT * FROM messages WHERE (author = $1) OR (recipient = $1)', [name])
    return { messages: response.rows as IMessage[] }
  } catch (error) {
    return { error: { getMessageError: error }, messages: [] as IMessage[] }
  }
}

export async function getUsers() {
  try {
    const response = await db.query('SELECT * FROM users')
    return { users: response.rows as IUser[] }
  } catch (error) {
    return { error: { getUsers: error }, users: [] as IUser[] }
  }
}

export async function saveMessage({ author, recipient, timestamp, text, title }: Omit<IMessage, "id">) {
  try {
    const response = await db.query(`
                        INSERT INTO messages (author, recipient, timestamp, title, text)
                        values ($1, $2, $3, $4, $5)
                        RETURNING *`, [author, recipient, timestamp, title, text])
    return { message: response.rows[0] as IMessage }
  } catch (error) {
    return { error: { saveMessageError: error, message: {} as IMessage } }
  }
}

export async function addUser(name: string) {
  try {
    const response = await db.query('INSERT INTO users (name) values ($1) RETURNING *', [name])
    return { user: response.rows[0] as IUser }
  } catch (error) {
    return { error: { addUserError: error } }
  }
}
