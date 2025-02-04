import jwt from "jsonwebtoken";
import { FastifyReply, FastifyRequest } from "fastify";

export async function verificarToken(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    (request as any).user = decoded;
  } catch (error) {
    return reply.status(403).send({ message: "Token inválido" });
  }
}