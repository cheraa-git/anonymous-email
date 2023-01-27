import { FC, FormEvent, useEffect, useRef, useState } from "react"
import { Button } from "@mui/material"
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { connect } from "../store/appActions"
import { Loader } from "../components/Loader/Loader"
import { setError } from "../store/appSlices"


export const AuthPage: FC = () => {
  const dispatch = useAppDispatch()
  const { loading, authError } = useAppSelector((state: RootState) => state.app)
  const [inpValue, setInpValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  })

  const singInHandler = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    if (!inpValue) return dispatch(setError('Nickname not entered'))
    dispatch(connect(inpValue.trim().toLowerCase()))
  }

  return (
    <div className=" max-w-[460px] sm:mx-auto mt-8 text-center bg-gray-100 p-5 rounded-2xl mx-4">
      <p className="bg-red-100 rounded-lg text-gray-800">{authError ? authError : ''}</p>
      <p className="text-gray-500 mb-2 text-center">Enter nickname</p>
      <form onSubmit={(e) => singInHandler(e)}>
        <input className="outline-none rounded mb-3 px-4 py-2 sm:w-2/3 w-full"
               value={inpValue}
               onChange={(e) => setInpValue(e.target.value)}
               ref={inputRef}
        />
      </form>
      <div className="text-end mr-3">
        {loading ? <Loader/> : <Button onClick={() => singInHandler()}>Sign in</Button>}

      </div>
    </div>
  )
}
