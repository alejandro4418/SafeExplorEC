import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

const PublicRoute = () => {
    const { estaAutenticado } = useAuth()
    return estaAutenticado ? <Navigate to="/dashboard/profile" replace /> : <Outlet />
}

export default PublicRoute
