import { redis } from './redis'

const exitEvents = [
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
  'SIGKILL'
]

function cleanUpServer(eventType: string) {
  function exit() {
    if (eventType !== 'exit') {
      process.exit()
    }
  }

  if (redis.isOpen) {
    console.log('Redis connection is open. Disconnecting...')
    redis.quit().finally(() => {
      exit()
    })
  } else {
    exit()
  }
}

function unregisterPreviousCleanup() {
  exitEvents.forEach((eventType) => {
    process.off(eventType, cleanUpServer.bind(null, eventType))
  })
}

export function registerCleanup() {
  unregisterPreviousCleanup()

  exitEvents.forEach((eventType) => {
    process.on(eventType, cleanUpServer.bind(null, eventType))
  })
}
