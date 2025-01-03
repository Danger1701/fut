// solo para pruebas
import express from 'express'
import { routes } from './router/players.js'

const app = express()

app.use('/dada', routes)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, ()=> {
    console.log(`Server on: http://localhost:${PORT}`)
})