import { Route, Routes } from "react-router-dom"
import { HomePage } from "./pages/HomePage"
import { AuthPage } from "./pages/AuthPage"
import { NavBar } from "./components/NavBar"
import { RootState, useAppDispatch, useAppSelector } from "./store/store"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { useEffect } from "react"
import { autoConnect } from "./store/appActions"


function App() {
  const dispatch = useAppDispatch()
  const { name, connection } = useAppSelector((state: RootState) => state.app)
  const isAuth = !!(name && connection)

  useEffect(() => {
    dispatch(autoConnect())
  }, [dispatch])

  return (
    <>
      <NavBar/>
      <Routes>
        <Route path="" element={
          <ProtectedRoute isAllowed={isAuth}>
            <HomePage/>
          </ProtectedRoute>
        }/>
        <Route path="/auth" element={
          <ProtectedRoute isAllowed={!isAuth} redirectPath="/">
            <AuthPage/>
          </ProtectedRoute>
        }/>
      </Routes>
    </>
  )
}

export default App
