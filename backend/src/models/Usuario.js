import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import { randomBytes } from 'node:crypto'

const { Schema, model } = mongoose

const usuarioSchema = new Schema({
    nombre:   { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    pais:     { type: String, trim: true, default: null },
    celular:  { type: String, trim: true, default: null },
    email:    { type: String, required: true, trim: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    status:   { type: Boolean, default: true },
    token:    { type: String, default: null },
    confirmEmail: { type: Boolean, default: false },
    rol:      { type: String, default: "viajero" }
}, { timestamps: true })

// Cifrar el password
usuarioSchema.methods.encryptPassword = async function (passwordUser) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(passwordUser, salt)
}

// Comparar el password (login)
usuarioSchema.methods.matchPassword = async function (passwordUser) {
    return await bcrypt.compare(passwordUser, this.password)
}

// Token para correo (confirmación / recuperación). NO es el JWT
usuarioSchema.methods.createToken = function () {
    const tokenGenerado = randomBytes(16).toString('hex')
    this.token = tokenGenerado
    return tokenGenerado
}

export default model("Usuario", usuarioSchema)
