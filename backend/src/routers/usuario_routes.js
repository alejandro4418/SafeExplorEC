import { Router } from 'express'
import { registro, confirmarMail, login, recuperarPassword, comprobarTokenPassword, crearNuevoPassword } from '../controllers/usuario_controller.js'

const router = Router()

// Integrante 1: registro y confirmación de cuenta
router.post('/registro', registro)
router.get('/confirmar/:token', confirmarMail)

// Integrante 2: POST /login, POST /recuperarpassword, GET /recuperarpassword/:token, POST /nuevopassword/:token

router.post('/login', login)

router.post('/recuperarpassword', recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPassword)
router.post('/nuevopassword/:token', crearNuevoPassword)

// Integrante 3: GET /perfil, PUT /perfil/:id, PUT /actualizarpassword/:id (con middleware JWT)

export default router
