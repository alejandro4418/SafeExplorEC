// Integrante 3
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../context/AuthContext'

const inputClass = "block w-full rounded-md border border-gray-300 py-1 px-2 text-gray-700 focus:outline-none focus:border-gray-600"
const errorClass = "text-red-700 text-sm mt-1"

const FormProfile = () => {
    const { usuario, token, actualizarUsuario } = useAuth()
    const { fetchDataBackend, loading } = useFetch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    useEffect(() => {
        if (usuario) {
            reset({
                nombre: usuario.nombre ?? '',
                apellido: usuario.apellido ?? '',
                email: usuario.email ?? '',
                celular: usuario.celular ?? '',
                pais: usuario.pais ?? ''
            })
        }
    }, [usuario, reset])

    const actualizar = async (data) => {
        const url = `${import.meta.env.VITE_URL_BACKEND}/perfil/${usuario._id}`
        const response = await fetchDataBackend(url, data, "PUT", { Authorization: `Bearer ${token}` })
        if (response?.usuario) actualizarUsuario(response.usuario)
    }

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Actualizar datos</h2>
            <form onSubmit={handleSubmit(actualizar)} noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1 block text-sm font-semibold">Nombre</label>
                        <input type="text" className={inputClass}
                            {...register("nombre", { required: "El nombre es obligatorio" })} />
                        {errors.nombre && <p className={errorClass}>{errors.nombre.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold">Apellido</label>
                        <input type="text" className={inputClass}
                            {...register("apellido", { required: "El apellido es obligatorio" })} />
                        {errors.apellido && <p className={errorClass}>{errors.apellido.message}</p>}
                    </div>
                </div>

                <div className="mt-3">
                    <label className="mb-1 block text-sm font-semibold">Correo electrónico</label>
                    <input type="email" className={inputClass}
                        {...register("email", {
                            required: "El correo es obligatorio",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Correo electrónico no válido" }
                        })} />
                    {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                        <label className="mb-1 block text-sm font-semibold">Celular</label>
                        <input type="tel" className={inputClass}
                            {...register("celular", {
                                pattern: { value: /^\d{7,15}$/, message: "Solo números (entre 7 y 15 dígitos)" }
                            })} />
                        {errors.celular && <p className={errorClass}>{errors.celular.message}</p>}
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-semibold">País</label>
                        <input type="text" className={inputClass} {...register("pais")} />
                    </div>
                </div>

                <button disabled={loading}
                    className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-6 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white disabled:opacity-60 disabled:hover:scale-100">
                    {loading ? "Guardando..." : "Guardar cambios"}
                </button>
            </form>
        </div>
    )
}

export default FormProfile
