// Integrante 3
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { useFetch } from '../../hooks/useFetch'
import { useAuth } from '../../context/AuthContext'

const inputClass = "block w-full rounded-md border border-gray-300 py-1 px-2 pr-10 text-gray-700 focus:outline-none focus:border-gray-600"
const errorClass = "text-red-700 text-sm mt-1"

const CardPassword = () => {
    const [verPassword, setVerPassword] = useState(false)
    const { usuario, token } = useAuth()
    const { fetchDataBackend, loading } = useFetch()
    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm()

    const cambiarPassword = async (data) => {
        const url = `${import.meta.env.VITE_URL_BACKEND}/actualizarpassword/${usuario._id}`
        const response = await fetchDataBackend(url, data, "PUT", { Authorization: `Bearer ${token}` })
        if (response) reset()
    }

    const tipo = verPassword ? "text" : "password"
    const ojo = (
        <button type="button" onClick={() => setVerPassword(!verPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" aria-label="Mostrar u ocultar contraseña">
            {verPassword ? <MdVisibilityOff /> : <MdVisibility />}
        </button>
    )

    return (
        <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Cambiar contraseña</h2>
            <form onSubmit={handleSubmit(cambiarPassword)} noValidate>
                <div className="mb-3">
                    <label className="mb-1 block text-sm font-semibold">Contraseña actual</label>
                    <div className="relative">
                        <input type={tipo} className={inputClass} autoComplete="current-password"
                            {...register("passwordactual", { required: "La contraseña actual es obligatoria" })} />
                        {ojo}
                    </div>
                    {errors.passwordactual && <p className={errorClass}>{errors.passwordactual.message}</p>}
                </div>

                <div className="mb-3">
                    <label className="mb-1 block text-sm font-semibold">Nueva contraseña</label>
                    <div className="relative">
                        <input type={tipo} className={inputClass} autoComplete="new-password"
                            {...register("passwordnuevo", {
                                required: "La nueva contraseña es obligatoria",
                                pattern: { value: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/, message: "Mínimo 8 caracteres, con letras y números" }
                            })} />
                        {ojo}
                    </div>
                    {errors.passwordnuevo && <p className={errorClass}>{errors.passwordnuevo.message}</p>}
                </div>

                <div className="mb-3">
                    <label className="mb-1 block text-sm font-semibold">Confirmar nueva contraseña</label>
                    <div className="relative">
                        <input type={tipo} className={inputClass} autoComplete="new-password"
                            {...register("confirmpassword", {
                                required: "Debes confirmar la contraseña",
                                validate: (valor) => valor === watch("passwordnuevo") || "Las contraseñas no coinciden"
                            })} />
                        {ojo}
                    </div>
                    {errors.confirmpassword && <p className={errorClass}>{errors.confirmpassword.message}</p>}
                </div>

                <button disabled={loading}
                    className="bg-gray-600 text-slate-300 border py-2 w-full rounded-xl mt-3 hover:scale-105 duration-300 hover:bg-gray-900 hover:text-white disabled:opacity-60 disabled:hover:scale-100">
                    {loading ? "Actualizando..." : "Cambiar contraseña"}
                </button>
            </form>
        </div>
    )
}

export default CardPassword
