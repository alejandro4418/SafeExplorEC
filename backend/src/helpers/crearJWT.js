import jwt from 'jsonwebtoken'

export const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: '1d' })
}