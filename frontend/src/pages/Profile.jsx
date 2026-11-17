// Integrante 3
import { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { CardProfile } from '../components/profile/CardProfile'
import FormProfile from '../components/profile/FormProfile'
import CardPassword from '../components/profile/CardPassword'

const Profile = () => {
    const { token, actualizarUsuario, cerrarSesion } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const obtenerPerfil = async () => {
            try {
                const { data } = await axios.get(`${import.meta.env.VITE_URL_BACKEND}/perfil`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                actualizarUsuario(data)
            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 404) {
                    toast.error(error.response.data?.msg)
                    cerrarSesion()
                    navigate('/login', { replace: true })
                } else {
                    console.error(error)
                }
            }
        }
        obtenerPerfil()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token])

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-700">Mi perfil</h1>
            <p className="text-gray-500 mb-6">Consulta y actualiza tu información personal</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col gap-6">
                    <CardProfile />
                    <CardPassword />
                </div>
                <FormProfile />
            </div>
        </div>
    )
}

export default Profile
