import { useRoutes } from 'react-router-dom'
import MainLayout from './Layouts/MainLayout/MainLayout'
import Login from 'src/Pages/Login/Login'
import Register from 'src/Pages/Register/Register'
import ForgotPassword from 'src/Pages/Forgot_Password/forgotPassword'
import Home from 'src/Pages/Home/Home'
import Profile from 'src/Pages/Profile/Profile'
const useRouterElements = () => {
  const routeElemnts = useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <Home />
        </MainLayout>
      )
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/profile',
      element: <Profile />
    }
  ])
  return routeElemnts
}

export default useRouterElements
