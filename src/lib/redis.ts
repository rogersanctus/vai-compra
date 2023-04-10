import { createClient } from 'redis'

export const redis = createClient()
let connections = 0

redis.on('error', (error) => {
  console.error('Redis Client errror', error)
})

export async function connect() {
  connections++

  if (!redis.isOpen) {
    await redis.connect()
  }
}

export async function disconect() {
  console.info('redis connections:', connections)
  connections--

  if (connections === 0 && redis.isOpen) {
    console.info('disconecting...')
    redis.quit()
  }
}
