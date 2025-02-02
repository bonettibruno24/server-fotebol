import { db } from '#/db'
import { profiles } from '../db/schema'
import {and, eq} from 'drizzle-orm'
import bcrypt from 'bcrypt'

interface LoginRequest {
  email: string
  password: string
}
export async function loginUser({ email, password }: LoginRequest) {
  const result = await db
  .select()
  .from(profiles)
  .where(eq(profiles.email, email))

  if (result.length === 0) {
    throw new Error('User not found')
  }

  const user = result[0]

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

  if (!isPasswordValid) {
    throw new Error('Invalid password')
  }

  return { 
    message: 'Login realizado com sucesso!',
    user: {
      id: user.id,
      name: user.username,
      email: user.email,
    }
  }
}