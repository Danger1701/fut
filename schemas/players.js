const z = require('zod')

const playerSchema = z.object({

    name: z.string(),

    year: z.number().int().min(1990).max(2024),
    // year: z.number().int().min(1990).max(new Date().getFullYear()),

    height: z.number().int().min(100).max(230),

    genre : z.enum(['male', 'female'])
})

function validatePlayer (object) {
    return playerSchema.safeParse(object)
}

function validatePartialPlayer (object) {
    return playerSchema.partial().safeParse(object)
}

module.exports = { validatePlayer, validatePartialPlayer }