// Integrante 3
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { MdPerson, MdLogout } from 'react-icons/md'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
    const { usuario, cerrarSesion } = useAuth()
    const navigate = useNavigate()

    const salir = () => {
        cerrarSesion()
        navigate('/login', { replace: true })
    }

    const linkClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-md duration-200 ${isActive ? 'bg-gray-900 text-white' : 'text-slate-300 hover:bg-gray-700 hover:text-white'}`

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            <aside className="md:w-64 bg-gray-800 text-slate-300 p-5 flex md:flex-col gap-4 items-center md:items-stretch justify-between md:justify-start">
                <Link to="/" className="text-2xl font-bold text-white text-center">Quito Trip</Link>

                <div className="hidden md:block text-center border-b border-gray-600 pb-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-orange-300 text-gray-800 flex items-center justify-center text-2xl font-bold">
                        {usuario?.nombre?.[0]?.toUpperCase()}
                    </div>
                    <p className="mt-2 font-semibold text-white">{usuario?.nombre} {usuario?.apellido}</p>
                    <p className="text-xs capitalize">{usuario?.rol}</p>
                </div>

                <nav className="flex md:flex-col gap-2">
                    <NavLink to="/dashboard/profile" className={linkClass}><MdPerson /> Perfil</NavLink>
                </nav>

                <button onClick={salir}
                    className="md:mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-700 text-white hover:bg-red-900 duration-200">
                    <MdLogout /> Salir
                </button>
            </aside>

            <main className="flex-1 bg-gray-100 p-4 md:p-8 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    )
}

export default Dashboard
