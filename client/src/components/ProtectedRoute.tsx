import { FC, ReactNode } from "react"
import { Navigate, Outlet, } from "react-router-dom"

type ProtectedRouteProps = {
  isAllowed: boolean
  redirectPath?: string
  children?: ReactNode
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ isAllowed, redirectPath = '/auth', children }) => {

  if (!isAllowed) {
    return <Navigate to={redirectPath} replace/>
  }

  return <>{children ? children : <Outlet/>}</>
}
