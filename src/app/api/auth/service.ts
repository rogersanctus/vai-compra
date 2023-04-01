import { MissingEnvVariableError } from '@/lib/MissingEnvVariableError'
import { prismaClient } from '@/lib/prisma'
import argon2 from 'argon2'

type LoginResult = { id: number } | { error: unknown }

export async function doLogin(
  email: string,
  password: string
): Promise<LoginResult> {
  const prisma = prismaClient

  try {
    if (!process.env.CRYPTO_SALT) {
      throw new MissingEnvVariableError('CRYPTO_SALT')
    }

    const user = await prisma.user.findUnique({
      where: {
        email
      },
      select: {
        email: true,
        password_hash: true,
        id: true
      }
    })

    const salt = Buffer.from(process.env.CRYPTO_SALT, 'base64')

    if (user) {
      const verified = await argon2.verify(user.password_hash, password, {
        salt
      })

      return verified ? { id: user.id } : { error: 'wrong_password' }
    }

    return { error: 'user_not_found' }
  } catch (error) {
    console.error(error)
    return { error }
  }
}
