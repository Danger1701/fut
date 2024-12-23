import express, { json } from 'express'
import { randomUUID } from 'node:crypto'
import { validatePlayer, validatePartialPlayer } from './schemas/players.js'

import PLAYERS from './players.json' with { type: 'json' }

const app = express()
app.use(json())
app.disable('x-powered-by')

app.get('/', (req, res) => {
    
    console.log(req.body)
    res.json({
        message: 'WELCOME TO FUT '
    })

})

app.get('/players', (req, res) => { 

    const { genre } = req.query
    if (genre) {
        const filtredPlayers = PLAYERS.filter(
            player => player.genre.toLowerCase() === genre.toLowerCase()
        )
        return res.json(filtredPlayers)
    }
    res.json(PLAYERS);
});

app.get('/players/:id', (req, res) => {
    const id = req.params.id
    const player = PLAYERS.find( p => p.id === id )
    
    if (player) return res.json(player)
    
    res.status(404).json({
        message: 'Player not found'
    })
})

app.post('/players', (req, res) => {

    console.log(req.body)
    const result = validatePlayer(req.body)

    if (result.error) {
        return res.status(400).json({ // tmb puede ser error 422
            error: JSON.parse(result.error.message)
        })
    }
    
    const newPlayer = {
        id: randomUUID(),
        ...result.data
    }

    PLAYERS.push(newPlayer)
    res.status(201).json(newPlayer)
})

app.delete('/players/:id', (req, res) => {

    // CORS simple solution
    res.header('Access-Control-Allow-Origin', '*')

    const { id } = req.params
    const playerIndex = PLAYERS.findIndex( p => p.id === id)

    if ( playerIndex === -1 ) {
        return res.status(404).json({ message: 'Player not found' })
    }

    PLAYERS.splice(playerIndex, 1)

    return res.json({ message: 'Player deleted' })
 })

app.patch('/players/:id', (req, res) =>{

    const result = validatePartialPlayer(req.body)
    if (!result.success) {
        return res.status(400).json({ error: JSON.parse(result.error.message ) })
    }

    const { id } = req.params
    const playerIndex = PLAYERS.findIndex( p => p.id === id )
    if (playerIndex < 0) return res.status(404).json({ message: 'Player not found'})

    const playerUpdate = { ...PLAYERS[playerIndex], ...result.data}
    PLAYERS[playerIndex] = playerUpdate

    res.json(playerUpdate)
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


// https://youtu.be/-9d3KhCqOtU?list=PLUofhDIg_38qm2oPOV-IRTTEKyrVBBaU7&t=5398