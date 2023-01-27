import { FC, useState } from 'react'
import { Button, Dialog, IconButton, TextField, Select, MenuItem, SelectChangeEvent } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { IMessage } from "../../../types"
import { sendMessage } from "../store/appActions"
import { setMessageFilter } from "../store/appSlices"
import { Loader } from "./Loader/Loader"
import { RecipientInput } from "./RecipientInput"

export const ControlPanel: FC = () => {
  const dispatch = useAppDispatch()
  const { name, messageFilter, loading, users } = useAppSelector((state: RootState) => state.app)
  const [dialogIsOpen, setDialogIsOpen] = useState(false)
  const [titleValue, setTitleValue] = useState('')
  const [recipient, setRecipient] = useState('')
  const [textValue, setTextValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isUserExist, setIsUserExist] = useState(true)

  const clearState = () => {
    setDialogIsOpen(false)
    setTitleValue('')
    setRecipient('')
    setTextValue('')
    setIsUserExist(true)
  }

  const sendMessageHandler = () => {
    if (!titleValue || !textValue || !recipient) return setErrorMessage('Fill in all the fields')
    const sentData: Omit<IMessage, 'id'> = {
      title: titleValue, text: textValue, author: name.trim().toLocaleLowerCase(), recipient, timestamp: Date.now() + ''
    }
    if (!users.find(user => user.name === recipient) && isUserExist) {
      setErrorMessage('This user is not registered yet. Do you want to send it anyway?')
      setIsUserExist(false)
      return
    }
    dispatch(sendMessage(sentData))
    clearState()
  }

  const recipientHandler = (value: string) => {
    setRecipient(value)
    setIsUserExist(true)
    setErrorMessage('')
  }

  const closeDialog = () => {
    setDialogIsOpen(false)
    setErrorMessage('')
  }

  const setFilterHandler = (e: SelectChangeEvent<'inbox' | 'sent'>) => {
    const value = e.target.value as ('inbox' | 'sent')
    dispatch(setMessageFilter(value))
  }

  return (
    <div className="bg-orange-400 text-white rounded mt-5 mb-1 p-4 flex">
      <Button variant="contained" style={{ background: '#212936' }} onClick={() => setDialogIsOpen(true)}>
        New message
      </Button>

      <Select className="ml-4" size="small" value={messageFilter} onChange={setFilterHandler}>
        <MenuItem value="inbox">Inbox</MenuItem>
        <MenuItem value="sent">Sent</MenuItem>
      </Select>

      <Dialog fullWidth open={dialogIsOpen} onClose={closeDialog}>

        <IconButton className="w-min self-end" color="error" onClick={closeDialog}>
          <CloseIcon/>
        </IconButton>

        <p className="bg-red-100 rounded-lg text-center mx-5">{errorMessage ? errorMessage : ''}</p>

        <div className="px-10 pb-10 pt-5">
          <h1 className="text-3xl text-center text-gray-600">Send a new message...</h1>
          <RecipientInput value={recipient} setValue={recipientHandler}/>

          <TextField margin="normal" label="Message title" fullWidth value={titleValue}
                     onChange={e => setTitleValue(e.target.value)}/>

          <TextField margin="normal" label="Message text" multiline rows={8} fullWidth value={textValue}
                     onChange={e => setTextValue(e.target.value)}/>

          <div className="flex justify-end text-orange-400">
            <Button color="inherit" onClick={sendMessageHandler}>{isUserExist ? 'Send' : 'Send anyway'}</Button>
          </div>
        </div>
      </Dialog>

      <div className="ml-auto mr-5">
        {loading ? <Loader/> : ''}
      </div>

    </div>
  )
}
