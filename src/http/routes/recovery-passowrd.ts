import express from "express";
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { enviarEmail } from "../../services/recorery-passowrd.service";
import { db } from "#/db";
import { profiles } from "#/db/schema";
import { eq } from "drizzle-orm";

dotenv.config();

const app = express()
app.use(express.json())


export async function recoveryPasswordRoute(app: FastifyInstance) {
  app.post("/recovery-password", async (req: express.Request, res: express.Response) => {
    const { email } = req.body;

    const genericResponse = { message: "Se este e-mail existir, enviaremos um link de recuperação!" };
    
    const user = await db
    .select()
    .from(profiles)
    .where(eq(profiles.email, email));

    if (user.length === 0) {
      return res.status(200).send(genericResponse);
    }

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });
    await enviarEmail(
      email,
      "Recuperação de Senha",
      `<p>Olá, clique no link abaixo para redefinir sua senha: <a href="http://localhost:3000/reset-password/${token}">Redefinir Senha</a></p>`
    );

    return res.status(200).send(genericResponse);
  });
}
