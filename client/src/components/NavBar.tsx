import { FC } from "react"
import logoutIcon from '../assets/logout.svg'
import { RootState, useAppDispatch, useAppSelector } from "../store/store"
import { logout } from "../store/appSlices"

export const NavBar: FC = () => {
  const dispatch = useAppDispatch()
  const name = useAppSelector((state: RootState) => state.app.name)
  const logoutHandler = () => {
    dispatch(logout())
  }
  return (
    <nav className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-2">
        <div className="relative flex h-16 items-center text-white">
          <div className="block sm:flex min-w-[200px]">
            <h1 className="text-3xl text-start">Anonymous e-mail</h1>
          </div>
          <div className="ml-auto flex">
            <p className="text-xl mr-3 capitalize">{name}</p>
            {
              name
              && <img className="text-white transition-opacity hover:opacity-70 cursor-pointer"
                      src={logoutIcon}
                      width={30}
                      alt="logout-icon"
                      onClick={logoutHandler}
              />
            }
          </div>
        </div>
      </div>
    </nav>
  )
}
