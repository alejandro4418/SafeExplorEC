# Quito Trip
 
Aplicación web para planificar viajes por Quito con ayuda de un asistente de IA.
Proyecto desarrollado por Scrum
 
## Tecnologías
 
| Parte | Tecnologías |
|---|---|
| Backend | Node.js, Express 5, Mongoose, bcryptjs, Nodemailer, CORS, dotenv |
| Frontend | React 18, Vite, Tailwind CSS 4, React Router 7, react-hook-form, axios, react-toastify |
| Base de datos | MongoDB Atlas |
| Correos de prueba | Mailtrap (Sandbox) |
 
## Estructura del proyecto
 
```
backend/
  src/
    config/        nodemailer.js
    controllers/   usuario_controller.js
    models/        Usuario.js
    routers/       usuario_routes.js
    database.js    index.js    server.js
frontend/
  src/
    components/    hooks/    layout/    pages/
    App.jsx        main.jsx
```
 
## Instalación y ejecución
 
### 1. Clonar e instalar
 
```bash
git clone <URL_DEL_REPOSITORIO>
cd backend && npm install
cd ../frontend && npm install
```
 
### 2. Variables de entorno
 
Cada integrante crea su propio `.env`. **No se sube al repositorio.**
 
**`backend/.env`** (usar `backend/.env.example` como plantilla):
 
```
PORT=3000
MONGODB_URI_LOCAL=<cadena de conexión de MongoDB>
FRONTEND_URL=http://localhost:5173
 
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=<usuario de Mailtrap>
SMTP_PASS=<contraseña de Mailtrap>
EMAIL_FROM="Quito Trip <no-reply@quitotrip.com>"
```
 
**`frontend/.env`**:
 
```
VITE_URL_BACKEND=http://localhost:3000/api
```
 
> Si la conexión `mongodb+srv://` falla con el error `querySrv ECONNREFUSED`, usar en Atlas la
> opción «Cadena URI heredada» (`mongodb://...`) o cambiar el DNS del equipo a `8.8.8.8` y `1.1.1.1`.
 
### 3. Ejecutar
 
En dos terminales:
 
```bash
# Terminal 1
cd backend
npm run dev      # http://localhost:3000
 
# Terminal 2
cd frontend
npm run dev      # http://localhost:5173
```
 
El backend debe mostrar `Server running at http://localhost:3000` y `Database is connected on ...`.
 
---
 
## Sprint 1: Módulo Usuarios (Viajeros)
 
El Sprint 1 corresponde al módulo de acceso, igual que el módulo de Veterinarios del proyecto de clase.
Cada integrante desarrolla una parte, con su backend y su frontend.
 
| Integrante | Parte del módulo | Backend | Frontend |
|---|---|---|---|
| 1. Alejandro Aguirre | Registro y verificación de cuenta | Cumple | Cumple |
| 2. Briander Verdezoto | Inicio de sesión y recuperación de contraseña | Cumple / No cumple | Cumple / No cumple |
| 3. Diego Almeida | Protección de rutas y perfil | Cumple / No cumple | Cumple / No cumple |
 
> Scrum Master: marcar «Cumple» o «No cumple» por cada integrante en backend y frontend.
 
### Modelo de datos: Usuario
 
Compartido por los tres integrantes (`backend/src/models/Usuario.js`).
 
| Campo | Tipo | Descripción |
|---|---|---|
| nombre | String | Obligatorio |
| apellido | String | Obligatorio |
| pais | String | Opcional |
| celular | String | Opcional |
| email | String | Obligatorio, único, en minúsculas |
| password | String | Obligatorio, cifrada con bcrypt |
| status | Boolean | Por defecto `true` |
| token | String | Token del correo (confirmación o recuperación). No es el JWT |
| confirmEmail | Boolean | `true` cuando la cuenta fue confirmada |
| rol | String | Por defecto `viajero` |
 
---
 
### Integrante 1: Registro y verificación de cuenta
 
**Responsable:** Alejandro Aguirre
 
#### Backend
 
Archivos: `controllers/usuario_controller.js`, `routers/usuario_routes.js`, `config/nodemailer.js`.
 
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/registro` | Registra un usuario, cifra la contraseña, genera el token y envía el correo de confirmación |
| GET | `/api/confirmar/:token` | Confirma la cuenta: marca `confirmEmail: true` y borra el token |
 
**Validaciones del registro**
 
- Nombre, apellido, correo y contraseña son obligatorios.
- El correo debe tener un formato válido y no estar registrado.
- La contraseña debe tener mínimo 8 caracteres, con letras y números.
- El celular es opcional y solo admite números (entre 7 y 15 dígitos).
- El correo se envía antes de guardar: si el envío falla, no queda ningún usuario guardado.
**Respuestas principales**
 
| Caso | Código | Mensaje |
|---|---|---|
| Registro correcto | 201 | Registro exitoso. Revisa tu correo electrónico para confirmar tu cuenta |
| Campos incompletos o inválidos | 400 | Mensaje según la validación |
| Correo ya registrado | 400 | Lo sentimos, el correo ya se encuentra registrado |
| Confirmación correcta | 200 | Cuenta confirmada. Ya puedes iniciar sesión |
| Token inválido o ya usado | 404 | El enlace no es válido o la cuenta ya fue confirmada |
| Error del servidor | 500 | Error en el servidor... |
 
#### Frontend
 
| Ruta | Archivo | Descripción |
|---|---|---|
| `/register` | `pages/Register.jsx` | Formulario de registro con validaciones, confirmación y visibilidad de contraseña |
| `/confirm/:token` | `pages/Confirm.jsx` | Confirma la cuenta al abrir el enlace del correo y muestra el resultado |
 
Ambas vistas usan el hook `useFetch` para consumir el backend y mostrar avisos de éxito o error.
 
#### Cómo probarlo
 
1. Abrir `http://localhost:5173/register` y llenar el formulario (puede usarse un correo inventado).
2. Abrir **Mailtrap > My Sandbox**: debe llegar el correo «Confirma tu cuenta en Quito Trip».
3. Hacer clic en **Confirmar mi cuenta**: debe mostrar «¡Muchas gracias!».
4. En MongoDB Atlas, colección `usuarios`: el usuario debe tener `confirmEmail: true` y `token: null`.
**Pruebas de errores:** registrar el mismo correo dos veces, usar una contraseña de menos de 8 caracteres
y abrir dos veces el mismo enlace de confirmación.
 
#### Evidencias
