import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { loginUser } from '#/services/create-auth-login.service'

export const loginUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/login', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
  }, async (request, reply) => {
    try {
      const { email, password } = request.body

      const authResponse = await loginUser({ email, password })

      return reply.status(200).send(authResponse)
    } catch (error) {
      return reply.status(400).send({ error: error.message })
    }
  })
}

