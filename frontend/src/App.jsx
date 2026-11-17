import { BrowserRouter, Route, Routes } from 'react-router'
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

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Rutas públicas */}
        <Route index element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='forgot/:id' element={<Forgot />} />
        <Route path='confirm/:token' element={<Confirm />} />
        <Route path='reset/:token' element={<Reset />} />
        <Route path='*' element={<NotFound />} />

        {/* Rutas privadas (el Integrante 3 las protege) */}
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='profile' element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
