import { Router, json } from "express";
import { randomUUID } from 'node:crypto'
import { validatePlayer, validatePartialPlayer } from '../schemas/players.js'
import PLAYERS from '../players.json' with { type: 'json' }

export const playersRouter = Router()

playersRouter.get('/', (req, res) => {
    const { genre } = req.query
    if (genre) {
        const filtredPlayers = PLAYERS.filter(
            player => player.genre.toLowerCase() === genre.toLowerCase()
        )
        return res.json(filtredPlayers)
    }
    res.json(PLAYERS);
})

playersRouter.get('/:id', (req, res) => {
    const id = req.params.id
    const player = PLAYERS.find( p => p.id === id )
    
    if (player) return res.json(player)
    
    res.status(404).json({
        message: 'Player not found'
    })
})

playersRouter.post('/', (req, res) => {

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

playersRouter.delete('/:id', (req, res) => {

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

playersRouter.patch('/:id', (req, res) =>{

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