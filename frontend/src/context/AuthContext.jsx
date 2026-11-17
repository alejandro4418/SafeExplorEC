import { createContext, useContext, useState } from "react"

const AuthContext = createContext(null)

const SESION_VACIA = { token: null, usuario: null }

// Lee la sesión guardada para que no se pierda al recargar la página
const leerSesion = () => {
    try {
        const guardada = localStorage.getItem("sesion")
        return guardada ? JSON.parse(guardada) : SESION_VACIA
    } catch {
        return SESION_VACIA
    }
}

export const AuthProvider = ({ children }) => {
    const [sesion, setSesion] = useState(leerSesion)

    // Se llama después de un login exitoso
    const iniciarSesion = ({ token, usuario }) => {
        const nueva = { token, usuario }
        localStorage.setItem("sesion", JSON.stringify(nueva))
        setSesion(nueva)
    }

    // El Integrante 3 la usará cuando se actualice el perfil
    const actualizarUsuario = (usuario) => {
        const nueva = { ...sesion, usuario }
        localStorage.setItem("sesion", JSON.stringify(nueva))
        setSesion(nueva)
    }

    const cerrarSesion = () => {
        localStorage.removeItem("sesion")
        setSesion(SESION_VACIA)
    }

    return (
        <AuthContext.Provider value={{
            token: sesion.token,
            usuario: sesion.usuario,
            estaAutenticado: Boolean(sesion.token),
            iniciarSesion,
            actualizarUsuario,
            cerrarSesion
        }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook para usar el contexto en cualquier componente
export const useAuth = () => useContext(AuthContext)