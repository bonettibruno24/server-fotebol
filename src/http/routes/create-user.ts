import {z} from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createUser } from '#/services/create-user.service'


export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/create-user', {
    schema: {
      body: z.object({
        username: z.string(),
        email: z.string().email(),
        passwordHash: z.string().min(6),
        specialCode: z.number().optional(),
        isAdmin: z.boolean().optional(),
      }),
    },
  }, async (request) => {
    const { username, email, passwordHash, isAdmin, specialCode } = request.body

    const newUser = await createUser({
      username,
      email,
      passwordHash,
      specialCode,
      isAdmin
    })

    return {
      data: newUser
    }
}
)
}