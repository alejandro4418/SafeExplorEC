import { useEffect, useRef, useState } from "react"
import { Link, useParams } from "react-router"
import { useFetch } from "../hooks/useFetch"

export const Confirm = () => {
    const { token } = useParams()
    const { fetchDataBackend } = useFetch()
    const [estado, setEstado] = useState("cargando") // cargando | ok | error
    // En modo desarrollo (StrictMode) los efectos corren dos veces; el token solo sirve una vez
    const yaConfirmado = useRef(false)

    useEffect(() => {
        if (yaConfirmado.current) return
        yaConfirmado.current = true

        const verifyToken = async () => {
            const url = `${import.meta.env.VITE_URL_BACKEND}/confirmar/${token}`
            const response = await fetchDataBackend(url, null, "GET")
            setEstado(response ? "ok" : "error")
        }
        verifyToken()
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-4">
            {estado === "cargando" && (
                <p className="text-xl text-gray-600">Confirmando tu cuenta...</p>
            )}

            {estado === "ok" && (
                <>
                    <p className="text-3xl md:text-4xl font-semibold text-gray-800">¡Muchas gracias!</p>
                    <p className="md:text-lg text-gray-600 mt-4">Tu cuenta ha sido confirmada, ya puedes iniciar sesión.</p>
                    <Link to="/login" className="p-3 mt-8 px-10 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Iniciar sesión</Link>
                </>
            )}

            {estado === "error" && (
                <>
                    <p className="text-3xl md:text-4xl font-semibold text-gray-800">No se pudo confirmar la cuenta</p>
                    <p className="md:text-lg text-gray-600 mt-4">El enlace no es válido o la cuenta ya fue confirmada.</p>
                    <Link to="/login" className="p-3 mt-8 px-10 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Ir a iniciar sesión</Link>
                </>
            )}
        </div>
    )
}
