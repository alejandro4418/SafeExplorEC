import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const verificarTokenJWT = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization || !authorization.startsWith('Bearer ')) {
        return res.status(401).json({ msg: "Acceso denegado: debes iniciar sesión" })
    }

    try {
        const token = authorization.split(' ')[1]
        const { id } = jwt.verify(token, process.env.JWT_SECRET)

        const usuarioBDD = await Usuario.findById(id).select('-password -token -__v -createdAt -updatedAt')
        if (!usuarioBDD) {
            return res.status(404).json({ msg: "El usuario del token ya no existe" })
        }
        if (!usuarioBDD.status) {
            return res.status(403).json({ msg: "Tu cuenta está deshabilitada" })
        }

        req.usuarioBDD = usuarioBDD
        next()
    } catch (error) {
        const msg = error.name === 'TokenExpiredError'
            ? "Tu sesión expiró, vuelve a iniciar sesión"
            : "Token inválido, vuelve a iniciar sesión"
        return res.status(401).json({ msg })
    }
}

export default verificarTokenJWT
