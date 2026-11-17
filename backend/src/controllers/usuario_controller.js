import Usuario from "../models/Usuario.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailer.js"

import { crearTokenJWT } from "../helpers/crearJWT.js"


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


// ---------- Login ----------
//POST /api/login

const login = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email || !password || String(email).trim() === "" || String(password).trim() === "") {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }

        const usuarioBDD = await Usuario.findOne({email: email.trim().toLowerCase()})

        //Mensaje por si el correo no existe o la password falla.
        if(!usuarioBDD) {
            return res.status(404).json({ msg: "El correo o la clave son incorrectos"})
        }

        if (!usuarioBDD.status) {
            return res.status(403).json({ msg: "Tu cuenta esta deshabilitada"})
        }

        if (!usuarioBDD.confirmEmail) {
            return res.status(403).json({msg: "Debes confirmar tu cuenta desde el correo antes de tu inicio de sesion"})
        }

        const passwordCorrecto = await usuarioBDD.matchPassword(password)
        if(!passwordCorrecto){
            return res.status(404).json({ msg: "El correo o la contraseña son incorrectos"})
        }

        const token = crearTokenJWT(usuarioBDD._id, usuarioBDD.rol)

        res.status(200).json({
            msg: `Bienvenido(a) ${usuarioBDD.nombre}`,
            token,
            usuario: {
                _id: usuarioBDD._id,
                nombre: usuarioBDD.nombre,
                apellido: usuarioBDD.apellido,
                email: usuarioBDD.email,
                celular: usuarioBDD.celular,
                pais: usuarioBDD.pais,
                rol: usuarioBDD.rol
            }
        })


    } catch(error) {
        console.error(error)
        res.status(500).json({msg: "Error ene l servidor, no se pudo iniciar sesion"})
    }
}

//--------------------------------------------------------------------------------------------------


// ---------- Recuperación de contraseña ----------
// POST /api/recuperarpassword
const recuperarPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email || String(email).trim() === "") {
            return res.status(400).json({ msg: "Debes ingresar tu correo electrónico" })
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ msg: "El correo electrónico no tiene un formato válido" })
        }

        const usuarioBDD = await Usuario.findOne({ email: email.trim().toLowerCase() })
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "No existe una cuenta con ese correo electrónico" })
        }

        // Si no confirmó la cuenta, su "token" aún es el de confirmación; no hay que pisarlo
        if (!usuarioBDD.confirmEmail) {
            return res.status(403).json({ msg: "Primero debes confirmar tu cuenta desde el correo de registro" })
        }

        const token = usuarioBDD.createToken()
        await sendMailToRecoveryPassword(usuarioBDD.email, token)
        await usuarioBDD.save()

        res.status(200).json({ msg: "Revisa tu correo electrónico para restablecer tu contraseña" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor, no se pudo enviar el correo de recuperación" })
    }
}

// GET /api/recuperarpassword/:token
const comprobarTokenPassword = async (req, res) => {
    try {
        const { token } = req.params

        const usuarioBDD = await Usuario.findOne({ token })
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "El enlace no es válido o ya fue utilizado" })
        }

        res.status(200).json({ msg: "Token confirmado, ya puedes crear tu nueva contraseña" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor, no se pudo comprobar el token" })
    }
}

// POST /api/nuevopassword/:token
const crearNuevoPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password, confirmpassword } = req.body

        if (!password || !confirmpassword || String(password).trim() === "" || String(confirmpassword).trim() === "") {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ msg: "La contraseña debe tener mínimo 8 caracteres, con letras y números" })
        }
        if (password !== confirmpassword) {
            return res.status(400).json({ msg: "Las contraseñas no coinciden" })
        }

        const usuarioBDD = await Usuario.findOne({ token })
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "El enlace no es válido o ya fue utilizado" })
        }

        usuarioBDD.password = await usuarioBDD.encryptPassword(password)
        usuarioBDD.token = null
        await usuarioBDD.save()

        res.status(200).json({ msg: "Contraseña actualizada. Ya puedes iniciar sesión con tu nueva contraseña" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor, no se pudo guardar la nueva contraseña" })
    }
}



const perfilPublico = (u) => ({
    _id: u._id,
    nombre: u.nombre,
    apellido: u.apellido,
    email: u.email,
    celular: u.celular,
    pais: u.pais,
    rol: u.rol
})

const esMismoUsuario = (req) => String(req.usuarioBDD._id) === String(req.params.id)

const perfil = (req, res) => {
    res.status(200).json(perfilPublico(req.usuarioBDD))
}

const actualizarPerfil = async (req, res) => {
    try {
        if (!esMismoUsuario(req)) {
            return res.status(403).json({ msg: "No puedes modificar el perfil de otro usuario" })
        }

        const { nombre, apellido, email, celular, pais } = req.body

        if ([nombre, apellido, email].some(campo => !campo || String(campo).trim() === "")) {
            return res.status(400).json({ msg: "Nombre, apellido y correo son obligatorios" })
        }
        if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ msg: "El correo electrónico no tiene un formato válido" })
        }
        if (celular && !SOLO_NUMEROS_REGEX.test(String(celular).trim())) {
            return res.status(400).json({ msg: "El celular debe contener solo números (entre 7 y 15 dígitos)" })
        }

        const usuarioBDD = await Usuario.findById(req.params.id)
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "No existe el usuario" })
        }

        const emailNormalizado = email.trim().toLowerCase()
        if (usuarioBDD.email !== emailNormalizado) {
            const existeEmail = await Usuario.findOne({ email: emailNormalizado })
            if (existeEmail) {
                return res.status(400).json({ msg: "Ese correo ya está registrado por otro usuario" })
            }
        }

        usuarioBDD.nombre = nombre.trim()
        usuarioBDD.apellido = apellido.trim()
        usuarioBDD.email = emailNormalizado
        usuarioBDD.celular = celular ? String(celular).trim() : null
        usuarioBDD.pais = pais?.trim() || null
        await usuarioBDD.save()

        res.status(200).json({ msg: "Perfil actualizado correctamente", usuario: perfilPublico(usuarioBDD) })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor, no se pudo actualizar el perfil" })
    }
}

const actualizarPassword = async (req, res) => {
    try {
        if (!esMismoUsuario(req)) {
            return res.status(403).json({ msg: "No puedes cambiar la contraseña de otro usuario" })
        }

        const { passwordactual, passwordnuevo, confirmpassword } = req.body

        if ([passwordactual, passwordnuevo, confirmpassword].some(campo => !campo || String(campo).trim() === "")) {
            return res.status(400).json({ msg: "Debes llenar todos los campos" })
        }
        if (!PASSWORD_REGEX.test(passwordnuevo)) {
            return res.status(400).json({ msg: "La contraseña debe tener mínimo 8 caracteres, con letras y números" })
        }
        if (passwordnuevo !== confirmpassword) {
            return res.status(400).json({ msg: "Las contraseñas no coinciden" })
        }

        const usuarioBDD = await Usuario.findById(req.params.id)
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "No existe el usuario" })
        }

        const passwordCorrecto = await usuarioBDD.matchPassword(passwordactual)
        if (!passwordCorrecto) {
            return res.status(400).json({ msg: "La contraseña actual es incorrecta" })
        }
        if (await usuarioBDD.matchPassword(passwordnuevo)) {
            return res.status(400).json({ msg: "La nueva contraseña debe ser diferente a la actual" })
        }

        usuarioBDD.password = await usuarioBDD.encryptPassword(passwordnuevo)
        await usuarioBDD.save()

        res.status(200).json({ msg: "Contraseña actualizada correctamente" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error en el servidor, no se pudo actualizar la contraseña" })
    }
}

export {
    registro,
    confirmarMail,
    login,
    recuperarPassword,
    comprobarTokenPassword,
    crearNuevoPassword,
    perfil,
    actualizarPerfil,
    actualizarPassword
}