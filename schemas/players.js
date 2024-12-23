import z from 'zod'

const playerSchema = z.object({

    name: z.string(),

    year: z.number().int().min(1990).max(2024),
    // year: z.number().int().min(1990).max(new Date().getFullYear()),

    height: z.number().int().min(100).max(230),

    genre : z.enum(['male', 'female'])
})

export function validatePlayer (object) {
    return playerSchema.safeParse(object)
}

export function validatePartialPlayer (object) {
    return playerSchema.partial().safeParse(object)
}