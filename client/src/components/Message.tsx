import { FC, useRef } from "react"
import { IMessage } from "../../../types"
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { RootState, useAppSelector } from "../store/store"

interface MessageProps {
  message: IMessage
}

export const Message: FC<MessageProps> = ({ message }) => {
  const textRef = useRef<HTMLParagraphElement>(null)
  const messageFilter = useAppSelector((state: RootState) => state.app.messageFilter)

  const formatDate = (timestamp: string) => {
    const date = new Date(+timestamp)
    return `${date.toLocaleTimeString()} ${date.toLocaleDateString()}`
  }

  return (
    <div className="py-2 px-4">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
          <p className="flex text-sm items-end mb-0.5 mr-3">{messageFilter === "inbox" ? 'from' : 'to'}:</p>
          <p className="font-bold mr-5">{messageFilter === 'inbox' ? message.author : message.recipient}</p>
          <p className="mx-5 text-gray-600">
            {message.title}
          </p>
          <p className="text-sm text-gray-400 ml-auto">{formatDate(message.timestamp)}</p>
        </AccordionSummary>

        <AccordionDetails>
          <p className="text-gray-500 text-[20px]" ref={textRef}>{message.text}</p>
        </AccordionDetails>

      </Accordion>
    </div>
  )
}
