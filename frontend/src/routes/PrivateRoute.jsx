import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = () => {
    const { estaAutenticado } = useAuth()
    return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />
}

export default PrivateRoute
