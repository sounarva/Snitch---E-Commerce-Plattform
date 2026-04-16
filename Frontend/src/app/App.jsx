import { RouterProvider } from 'react-router'
import router from './app.routes'
import { ToastProvider } from '../shared/Toaster'
import './App.css'
import useAuth from '../features/auth/hooks/useAuth'
import { useEffect } from 'react'

const App = () => {
  const { getme } = useAuth()
  useEffect(() => {
    getme()
  }, [])
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  )
}

export default App