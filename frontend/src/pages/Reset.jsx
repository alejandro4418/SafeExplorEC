// Integrante 2
import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router"
import { useForm } from "react-hook-form"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { useFetch } from "../hooks/useFetch"

const Reset = () => {
    const { token } = useParams()
    const navigate = useNavigate()
    const { fetchDataBackend, loading } = useFetch()
    const [estado, setEstado] = useState("cargando") // cargando | valido | invalido
    const [verPassword, setVerPassword] = useState(false)
    const [verConfirmar, setVerConfirmar] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    // En desarrollo (StrictMode) los efectos corren dos veces; así solo se comprueba una vez
    const yaComprobado = useRef(false)

    useEffect(() => {
        if (yaComprobado.current) return
        yaComprobado.current = true

        const comprobarToken = async () => {
            const url = `${import.meta.env.VITE_URL_BACKEND}/recuperarpassword/${token}`
            const response = await fetchDataBackend(url, null, "GET")
            setEstado(response ? "valido" : "invalido")
        }
        comprobarToken()
    }, [token])

    const cambiarPassword = async (data) => {
        const url = `${import.meta.env.VITE_URL_BACKEND}/nuevopassword/${token}`
        const response = await fetchDataBackend(url, data, "POST")
        if (response) {
            setTimeout(() => navigate("/login"), 2000)
        }
    }

    const inputClass = "block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-700 focus:outline-none focus:border-gray-600"
    const errorClass = "text-red-700 text-sm mt-1"

    // Mientras se comprueba el token
    if (estado === "cargando") {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl text-gray-600">Comprobando el enlace...</p>
            </div>
        )
    }

    // Token inválido o ya usado
    if (estado === "invalido") {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
                <p className="text-3xl md:text-4xl font-semibold text-gray-800">Enlace no válido</p>
                <p className="md:text-lg text-gray-600 mt-4">El enlace no es válido o ya fue utilizado. Puedes solicitar uno nuevo.</p>
                <Link to="/forgot" className="p-3 mt-8 px-10 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Solicitar nuevo enlace</Link>
            </div>
        )
    }

    // Token válido: formulario
    return (
        <div className="flex flex-col sm:flex-row h-screen">
            {/* Panel de la izquierda */}
            <div className="hidden sm:flex sm:w-1/3 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-300 px-8 text-center">
                <div>
                    <h2 className="text-4xl font-bold text-gray-800">Quito Trip</h2>
                    <p className="mt-4 text-gray-700">Crea una nueva contraseña para volver a entrar a tu cuenta.</p>
                </div>
            </div>

            {/* Formulario */}
            <div className="w-full sm:w-2/3 h-screen bg-white flex justify-center items-center overflow-y-auto">
                <div className="md:w-4/5 sm:w-full p-4">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">Nueva contraseña</h1>
                    <small className="text-gray-400 block my-4 text-sm">Ingresa y confirma tu nueva contraseña</small>

                    <form onSubmit={handleSubmit(cambiarPassword)} noValidate>
                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-semibold">Nueva contraseña</label>
                            <div className="relative">
                                <input type={verPassword ? "text" : "password"} placeholder="********************"
                                    className={`${inputClass} pr-10`}
                                    {...register("password", {
                                        required: "La contraseña es obligatoria",
                                        pattern: {
                                            value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
                                            message: "Mínimo 8 caracteres, con letras y números"
                                        }
                                    })} />
                                <button type="button" onClick={() => setVerPassword(!verPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Mostrar u ocultar contraseña">
                                    {verPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                </button>
                            </div>
                            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-semibold">Confirmar contraseña</label>
                            <div className="relative">
                                <input type={verConfirmar ? "text" : "password"} placeholder="********************"
                                    className={`${inputClass} pr-10`}
                                    {...register("confirmpassword", {
                                        required: "Debes confirmar la contraseña",
                                        validate: (valor) => valor === watch("password") || "Las contraseñas no coinciden"
                                    })} />
                                <button type="button" onClick={() => setVerConfirmar(!verConfirmar)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Mostrar u ocultar contraseña">
                                    {verConfirmar ? <MdVisibilityOff /> : <MdVisibility />}
                                </button>
                            </div>
                            {errors.confirmpassword && <p className={errorClass}>{errors.confirmpassword.message}</p>}
                        </div>

                        <button disabled={loading}
                            className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white disabled:opacity-60 disabled:hover:scale-100">
                            {loading ? "Guardando..." : "Guardar nueva contraseña"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Reset