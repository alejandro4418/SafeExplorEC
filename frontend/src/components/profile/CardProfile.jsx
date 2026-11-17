// Integrante 3
import { useAuth } from '../../context/AuthContext'

export const CardProfile = () => {
    const { usuario } = useAuth()

    const datos = [
        ['Correo', usuario?.email],
        ['Celular', usuario?.celular],
        ['País', usuario?.pais]
    ]

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-300 text-gray-800 flex items-center justify-center text-2xl font-bold shrink-0">
                    {usuario?.nombre?.[0]?.toUpperCase()}
                </div>
                <div>
                    <p className="text-xl font-semibold text-gray-800">{usuario?.nombre} {usuario?.apellido}</p>
                    <p className="text-sm text-gray-500 capitalize">{usuario?.rol}</p>
                </div>
            </div>
            {datos.map(([etiqueta, valor]) => (
                <div key={etiqueta} className="flex justify-between border-b border-gray-100 py-2 text-sm">
                    <span className="font-semibold text-gray-600">{etiqueta}</span>
                    <span className="text-gray-800 text-right break-all">{valor || '—'}</span>
                </div>
            ))}
        </div>
    )
}
