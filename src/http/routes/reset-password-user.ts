import { resetPassword } from "../../services/reset-passoword.service";
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import {z} from 'zod'



export const resetPasswordRoute: FastifyPluginAsyncZod = async (app) => {
  app.post('/reset-password', {
    schema: {
      body: z.object({
        newPassword: z.string().min(6),
      }),
    },
  }, async (request) => {
    const token = request.headers.authorization?.split(" ")[1];
    const { newPassword } = request.body;
  
    if (!token) {
      return { success: false, message: "Token não fornecido." };
    }
  
    return resetPassword({ token, newPassword });
    });
  };