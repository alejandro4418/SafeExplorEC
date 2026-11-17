import Usuario from "../models/Usuario.js"
import { sendMailToRegister } from "../config/nodemailer.js"

// ---------- Validaciones ----------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/
const SOLO_NUMEROS_REGEX = /^\d{7,15}$/

const validarRegistro = ({ nombre, apellido, email, password, celular }) => {
    if ([nombre, apellido, email, password].some(campo => !campo || String(campo).trim() === "")) {
        return "Debes llenar todos los campos obligatorios"
    }
    if (!EMAIL_REGEX.test(email)) {
        return "El correo electrónico no tiene un formato válido"
    }
    if (!PASSWORD_REGEX.test(password)) {
        return "La contraseña debe tener mínimo 8 caracteres, con letras y números"
    }
    if (celular && !SOLO_NUMEROS_REGEX.test(celular)) {
        return "El celular debe contener solo números (entre 7 y 15 dígitos)"
    }
    return null
}

// ---------- Registro ----------
// POST /api/registro
const registro = async (req, res) => {
    try {
        const { nombre, apellido, pais, celular, email, password } = req.body

        const errorValidacion = validarRegistro(req.body)
        if (errorValidacion) return res.status(400).json({ msg: errorValidacion })

        const emailNormalizado = email.trim().toLowerCase()
        const existeEmail = await Usuario.findOne({ email: emailNormalizado })
        if (existeEmail) {
            return res.status(400).json({ msg: "Lo sentimos, el correo ya se encuentra registrado" })
        }

        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            pais: pais?.trim() || null,
            celular: celular?.trim() || null,
            email: emailNormalizado
        })
        nuevoUsuario.password = await nuevoUsuario.encryptPassword(password)
        const token = nuevoUsuario.createToken()

        // Se envía el correo antes de guardar: si falla el envío, no queda un usuario "huérfano"
        await sendMailToRegister(emailNormalizado, nuevoUsuario.nombre, token)
        await nuevoUsuario.save()

        res.status(201).json({ msg: "Registro exitoso. Revisa tu correo electrónico para confirmar tu cuenta" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor, no se pudo completar el registro" })
    }
}

// ---------- Confirmación de cuenta ----------
// GET /api/confirmar/:token
const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params

        const usuarioBDD = await Usuario.findOne({ token })
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "El enlace no es válido o la cuenta ya fue confirmada" })
        }

        usuarioBDD.token = null
        usuarioBDD.confirmEmail = true
        await usuarioBDD.save()

        res.status(200).json({ msg: "Cuenta confirmada. Ya puedes iniciar sesión" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor, no se pudo confirmar la cuenta" })
    }
}

export {
    registro,
    confirmarMail
}
