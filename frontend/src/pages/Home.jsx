import { Link } from 'react-router'

export const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-amber-100 to-orange-200 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800">Quito Trip</h1>
            <p className="mt-4 text-lg text-gray-600 max-w-xl">
                Planifica tu viaje por Quito con ayuda de un asistente de IA.
            </p>
            <div className="mt-8 flex gap-4">
                <Link to="/register" className="py-2 px-6 bg-gray-700 text-white rounded-xl hover:bg-gray-900 duration-300">Registrarse</Link>
                <Link to="/login" className="py-2 px-6 border border-gray-700 text-gray-700 rounded-xl hover:bg-white duration-300">Iniciar sesión</Link>
            </div>
        </div>
    )
}
