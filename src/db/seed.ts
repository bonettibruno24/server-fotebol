import { client, db } from '.'
import { profiles, tournaments } from './schema'

async function seed() {
  await db.delete(profiles)
  await db.delete(tournaments)

  const result = await db.insert(profiles).values([
    {
      
    }
  ])
}