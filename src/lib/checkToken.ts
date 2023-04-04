import { InvalidTokenError } from '@/lib/errors/InvalidTokenError'
import { MissingEnvVariableError } from '@/lib/errors/MissingEnvVariableError'
import { importSPKI, jwtVerify } from 'jose'

export async function checkToken(token: string | undefined) {
  if (!token) {
    throw new Error('Auth session is missing')
  }

  if (!process.env.JWT_PUB_KEY) {
    throw new MissingEnvVariableError('JWT_PUB_KEY')
  }

  if (!process.env.RSA_ALG) {
    throw new MissingEnvVariableError('RSA_ALG')
  }

  const alg = process.env.RSA_ALG
  const pubKey = await importSPKI(process.env.JWT_PUB_KEY, alg)

  try {
    return await jwtVerify(token, pubKey)
  } catch (error) {
    throw new InvalidTokenError(error)
  }
}

export async function getUserIdFromSession(token: string | undefined) {
  if (!token) {
    throw new Error('Auth session is missing')
  }

  if (!process.env.JWT_PUB_KEY) {
    throw new MissingEnvVariableError('JWT_PUB_KEY')
  }

  if (!process.env.RSA_ALG) {
    throw new MissingEnvVariableError('RSA_ALG')
  }

  const pkey = await importSPKI(process.env.JWT_PUB_KEY, process.env.RSA_ALG)

  const { payload } = await jwtVerify(token, pkey)

  return payload.id as number
}
