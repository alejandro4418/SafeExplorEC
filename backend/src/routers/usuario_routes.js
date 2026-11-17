import { Router } from 'express'
import { registro, confirmarMail, login, recuperarPassword, comprobarTokenPassword, crearNuevoPassword, perfil, actualizarPerfil, actualizarPassword } from '../controllers/usuario_controller.js'
import verificarTokenJWT from '../middlewares/autenticacion.js'

const router = Router()

// Integrante 1: registro y confirmación de cuenta
router.post('/registro', registro)
router.get('/confirmar/:token', confirmarMail)

// Integrante 2: POST /login, POST /recuperarpassword, GET /recuperarpassword/:token, POST /nuevopassword/:token

router.post('/login', login)

router.post('/recuperarpassword', recuperarPassword)
router.get('/recuperarpassword/:token', comprobarTokenPassword)
router.post('/nuevopassword/:token', crearNuevoPassword)

// Integrante 3
router.get('/perfil', verificarTokenJWT, perfil)
router.put('/perfil/:id', verificarTokenJWT, actualizarPerfil)
router.put('/actualizarpassword/:id', verificarTokenJWT, actualizarPassword)

export default router
