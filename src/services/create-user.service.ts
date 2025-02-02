import { db } from '#/db'
import {profiles} from '../db/schema'
import bcrypt from 'bcrypt'


interface createUserRequests {
  username: string
  email: string
  passwordHash: string
  isAdmin: boolean | undefined
  specialCode: number | undefined
}

export async function createUser({ 
  username,
  email,
  passwordHash,
  specialCode,
  isAdmin
}:createUserRequests) {
  const saltRounds = 10;
  const teste = passwordHash;
  const hashedPassword = await bcrypt.hash(passwordHash, saltRounds)
  const result = await db
  .insert(profiles)
  .values({
    username,
    email,
    passwordHash: hashedPassword,
    specialCode,
    isAdmin

  })
  .returning()
  const user = result[0]
  return {
    teste,
    user
  }
}