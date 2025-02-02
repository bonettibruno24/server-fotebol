import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { enviarEmail } from "../../services/recorery-passowrd.service";
import { db } from "#/db";
import { profiles } from "#/db/schema";
import { eq } from "drizzle-orm";

dotenv.config();

const app = express()
app.use(express.json())

interface User {
  id: number
  email: string
  password: string
}

export const recoveryPasswordRoute = async (req: Request, res: Response) => {
  const { email } = req.body
  const user = await db.select().from(profiles).where(eq(profiles.email, email))

  const genericResponse = { message: "Se este e-mail existir, enviaremos um link de recuperação!" };
  if (user.length === 0) {
    return res.status(200).json(genericResponse);
  }
    
    const token = jwt.sign({id: user[0].id}, process.env.JWT_SECRET as string, {
      expiresIn: "1h"
    })
    const link = `http://localhost:3000/reset-password/${token}`;
    await enviarEmail(
      email,
      "Recuperação de Senha",
      `<p>Olá, clique no link abaixo para redefinir sua senha:</p>
       <a href="${link}">Redefinir Senha</a>`
    );
    
    res.json({ message: "Email enviado com sucesso!!" });
    };
  

const PORT = 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


