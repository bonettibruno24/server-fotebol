import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db } from "#/db";
import { profiles } from "#/db/schema";
import { eq } from "drizzle-orm";

interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export async function resetPassword({ token, newPassword }: ResetPasswordRequest) {
  try {
    // Verifica se o token é válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

    if (!decoded.id) {
      return { success: false, message: "Token inválido ou expirado." };
    }

    console.log("ID do usuário extraído do token:", decoded.id);

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha no banco de dados
    const result = await db.update(profiles)
      .set({ passwordHash: hashedPassword })
      .where(eq(profiles.id, decoded.id));

    console.log("Resultado da atualização no banco:", result);

    return { success: true, message: "Senha redefinida com sucesso!" };
  } catch (error) {
    console.error("Erro ao redefinir senha:", error); // Exibe o erro real no console
    return { success: false, message: "Erro ao redefinir senha." };
  }
}