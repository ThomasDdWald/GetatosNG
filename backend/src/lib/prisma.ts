import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

type NullableString = string | undefined

function requireEnv(name: string, value: NullableString): string {
  const trimmed = value?.trim()
  if (!trimmed) {
    throw new Error(`${name} is missing`)
  }
  return trimmed
}

function optionalEnv(value: NullableString): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function maskDatabaseUrl(url: string): string {
  return url.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:***@')
}

function buildSocketPath(): string | undefined {
  const instanceUnixSocket = optionalEnv(process.env.INSTANCE_UNIX_SOCKET)
  if (instanceUnixSocket) {
    return instanceUnixSocket.startsWith('/')
      ? instanceUnixSocket
      : `/${instanceUnixSocket}`
  }

  const instanceConnectionName = optionalEnv(process.env.INSTANCE_CONNECTION_NAME)
  if (instanceConnectionName) {
    return `/cloudsql/${instanceConnectionName}`
  }

  return undefined
}

function buildDatabaseUrl(): string {
  const existingUrl = optionalEnv(process.env.DATABASE_URL)
  if (existingUrl) {
    return existingUrl
  }

  const dbUser = requireEnv('DB_USER', process.env.DB_USER)
  const dbPass = requireEnv('DB_PASS', process.env.DB_PASS)
  const dbName = optionalEnv(process.env.DB_NAME) ?? 'getatos_safari'

  const socketPath = buildSocketPath()
  if (socketPath) {
    const params = new URLSearchParams({
      host: socketPath,
      schema: 'public'
    })

    return `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPass)}@localhost/${encodeURIComponent(dbName)}?${params.toString()}`
  }

  const dbHost = optionalEnv(process.env.DB_HOST) ?? 'localhost'
  const dbPort = optionalEnv(process.env.DB_PORT) ?? '5432'
  const params = new URLSearchParams({
    schema: 'public'
  })

  return `postgresql://${encodeURIComponent(dbUser)}:${encodeURIComponent(dbPass)}@${dbHost}:${dbPort}/${encodeURIComponent(dbName)}?${params.toString()}`
}

const databaseUrl = buildDatabaseUrl()
process.env.DATABASE_URL = databaseUrl

console.log('DATABASE_URL:', maskDatabaseUrl(databaseUrl))

declare global {
  // eslint-disable-next-line no-var
  var __prisma__: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    },
    log: ['warn', 'error']
  })
}

export const prisma: PrismaClient =
  globalThis.__prisma__ ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma__ = prisma
}

export async function connectPrisma(): Promise<void> {
  await prisma.$connect()
  console.log('Prisma connected successfully')
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect()
}

export default prisma
