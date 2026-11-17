import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { ToastContainer } from 'react-toastify'
import { Home } from './pages/Home'
import Login from './pages/Login'
import { Register } from './pages/Register'
import { Forgot } from './pages/Forgot'
import { Confirm } from './pages/Confirm'
import { NotFound } from './pages/NotFound'
import Reset from './pages/Reset'
import Dashboard from './layout/Dashboard'
import Profile from './pages/Profile'
import PublicRoute from './routes/PublicRoute'
import PrivateRoute from './routes/PrivateRoute'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route index element={<Home />} />
        <Route path='confirm/:token' element={<Confirm />} />
        <Route path='reset/:token' element={<Reset />} />

        <Route element={<PublicRoute />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='forgot' element={<Forgot />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path='dashboard' element={<Dashboard />}>
            <Route index element={<Navigate to='profile' replace />} />
            <Route path='profile' element={<Profile />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
