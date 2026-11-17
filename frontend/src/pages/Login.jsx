// Integrante 2
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useForm } from "react-hook-form"
import { MdVisibility, MdVisibilityOff } from "react-icons/md"
import { useFetch } from "../hooks/useFetch"
import { useAuth } from "../context/AuthContext"

const Login = () => {
    const [verPassword, setVerPassword] = useState(false)
    const { fetchDataBackend, loading } = useFetch()
    const { iniciarSesion } = useAuth()
    const navigate = useNavigate()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const loginUser = async (data) => {
        const url = `${import.meta.env.VITE_URL_BACKEND}/login`
        const response = await fetchDataBackend(url, data, "POST")
        if (response) {
            // Guarda token y usuario en el contexto (y en localStorage)
            iniciarSesion({ token: response.token, usuario: response.usuario })
            navigate("/dashboard/profile")
        }
    }

    const inputClass = "block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-700 focus:outline-none focus:border-gray-600"
    const errorClass = "text-red-700 text-sm mt-1"

    return (
        <div className="flex flex-col sm:flex-row h-screen">
            {/* Panel de la izquierda */}
            <div className="hidden sm:flex sm:w-1/3 items-center justify-center bg-gradient-to-br from-amber-100 to-orange-300 px-8 text-center">
                <div>
                    <h2 className="text-4xl font-bold text-gray-800">Quito Trip</h2>
                    <p className="mt-4 text-gray-700">Inicia sesión y continúa planificando tu viaje por Quito.</p>
                </div>
            </div>

            {/* Formulario */}
            <div className="w-full sm:w-2/3 h-screen bg-white flex justify-center items-center overflow-y-auto">
                <div className="md:w-4/5 sm:w-full p-4">
                    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">Bienvenido(a) de nuevo</h1>
                    <small className="text-gray-400 block my-4 text-sm">Por favor ingresa tus datos</small>

                    <form onSubmit={handleSubmit(loginUser)} noValidate>
                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-semibold">Correo electrónico</label>
                            <input type="email" placeholder="Ingresa tu correo" className={inputClass}
                                {...register("email", {
                                    required: "El correo es obligatorio",
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo electrónico no válido" }
                                })} />
                            {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                        </div>

                        <div className="mb-3">
                            <label className="mb-1 block text-sm font-semibold">Contraseña</label>
                            <div className="relative">
                                <input type={verPassword ? "text" : "password"} placeholder="********************"
                                    className={`${inputClass} pr-10`}
                                    {...register("password", { required: "La contraseña es obligatoria" })} />
                                <button type="button" onClick={() => setVerPassword(!verPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Mostrar u ocultar contraseña">
                                    {verPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                </button>
                            </div>
                            {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                        </div>

                        <button disabled={loading}
                            className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-5 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white disabled:opacity-60 disabled:hover:scale-100">
                            {loading ? "Ingresando..." : "Iniciar sesión"}
                        </button>
                    </form>

                    <div className="mt-4 text-sm text-center">
                        <Link to="/forgot" className="text-gray-500 underline hover:text-gray-900">¿Olvidaste tu contraseña?</Link>
                    </div>

                    <div className="mt-5 text-xs border-b-2 py-4"></div>

                    <div className="mt-3 text-sm flex justify-between items-center">
                        <p>¿Aún no tienes una cuenta?</p>
                        <Link to="/register" className="py-2 px-5 bg-gray-600 text-slate-300 border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900 hover:text-white">Registrarse</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login