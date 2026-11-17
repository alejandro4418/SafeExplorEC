import nodemailer from 'nodemailer'

// El transporter se crea al enviar, porque dotenv.config() se ejecuta
// después de que se importan los módulos.
const crearTransporter = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export const sendMailToRegister = async (email, nombre, token) => {
    const enlace = `${process.env.FRONTEND_URL}/confirm/${token}`

    await crearTransporter().sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Confirma tu cuenta en Quito Trip",
        html: `
            <h2>Hola ${nombre}, bienvenido(a)</h2>
            <p>Para activar tu cuenta haz clic en el siguiente enlace:</p>
            <a href="${enlace}">Confirmar mi cuenta</a>
            <p>Si no creaste esta cuenta, ignora este mensaje.</p>
        `
    })
}
