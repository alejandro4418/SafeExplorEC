// Requerir módulos
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import routerUsuarios from "./routers/usuario_routes.js"

// Inicializaciones
const app = express()

// Configuraciones
dotenv.config()
app.set("port", process.env.PORT || 3000)

// Middlewares
app.use(express.json())
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }))

// Rutas
app.get("/", (req, res) => res.send({ message: "Bienvenido a la API de Quito Trip" }))
app.use("/api", routerUsuarios)

// Integrantes 2 y 3: agreguen aquí su import y su app.use("/api", ...)

export default app
