import { MissingEnvVariableError } from '@/lib/errors/MissingEnvVariableError'
import { prismaClient } from '@/lib/prisma'
import argon2 from 'argon2'
import { NextResponse, type NextRequest } from 'next/server'
import { ZodError, z } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const signupData = z.object({
      name: z.string().nonempty(),
      email: z.string().nonempty().email(),
      birthdate: z.coerce.date(),
      password: z.string().nonempty().min(4)
    })

    if (!process.env.CRYPTO_SALT) {
      throw new MissingEnvVariableError('CRYPTO_SALT')
    }

    const salt = Buffer.from(process.env.CRYPTO_SALT ?? '', 'base64')

    const parsed = signupData.parse(data)
    const password_hash = await argon2.hash(parsed.password, {
      salt
    })

    // The user data going to prisma create must have no 'passsword' field
    const partialParsed = { ...parsed } as Partial<typeof parsed>
    delete partialParsed.password
    const userData = partialParsed as Omit<typeof parsed, 'password'>

    const prisma = prismaClient
    const user = await prisma.user.create({
      data: {
        ...userData,
        password_hash
      },
      select: {
        name: true,
        email: true
      }
    })

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error(error)
    if (error instanceof ZodError) {
      return NextResponse.json({ error }, { status: 400 })
    }
    const _error = error as any
    return NextResponse.json(
      { error: { message: _error.message ? _error.message : 'unknown error' } },
      { status: 500 }
    )
  }
}
