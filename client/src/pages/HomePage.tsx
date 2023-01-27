import { FC } from "react"
import { MessagesList } from "../components/MessagesList"
import { ControlPanel } from "../components/ControlPanel"

export const HomePage: FC = () => {

  return (
    <div className="max-w-[1024px] mx-auto px-10">
      <ControlPanel/>
      <MessagesList/>
    </div>
  )
}
