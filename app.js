import express, { json } from 'express'
import { playersRouter } from './router/players.js'
import PLAYERS from './players.json' with { type: 'json' }

const app = express()
app.use(json())
app.disable('x-powered-by')

app.use('/players', playersRouter)

app.get('/', (req, res) => {
    console.log(PLAYERS)
    res.json({ message: 'WELCOME TO FUT'})
})

app.options('/players/:id', (req, res) => {
    // CORS simple solution
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')

    res.send(200)
})

const PORT = process.env.PORT ?? 1234

app.listen(PORT, ()=> {
    console.log(`Server on: http://localhost:${PORT}`)
})


// https://youtu.be/ev3Yxva4wI4?list=PLUofhDIg_38qm2oPOV-IRTTEKyrVBBaU7&t=1777