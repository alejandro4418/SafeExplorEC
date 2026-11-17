import { Link } from 'react-router'

export const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            <p className="text-7xl font-bold text-gray-400">404</p>
            <p className="text-3xl md:text-4xl text-gray-800 mt-6">Página no encontrada</p>
            <p className="md:text-lg text-gray-600 mt-4">Lo sentimos mucho</p>
            <Link to="/" className="p-3 mt-6 px-10 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Regresar</Link>
        </div>
    )
}
