import { InvalidTokenError } from '@/lib/errors/InvalidTokenError'
import { MissingEnvVariableError } from '@/lib/errors/MissingEnvVariableError'
import { SignJWT, importPKCS8, importSPKI, jwtVerify } from 'jose'
import { MissingAuthSessionError } from './errors/MissingAuthSessionError'

export async function checkToken(token: string | undefined) {
  if (!token) {
    throw new MissingAuthSessionError()
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
    throw new MissingAuthSessionError()
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

export async function signJWT(payload: { id: number }) {
  if (!process.env.JWT_PRIV_KEY) {
    throw new MissingEnvVariableError('JWT_PRIV_KEY')
  }

  if (!process.env.RSA_ALG) {
    throw new MissingEnvVariableError('RSA_ALG')
  }

  const alg = process.env.RSA_ALG
  const privKeyEncoded = process.env.JWT_PRIV_KEY
  const privKey = await importPKCS8(privKeyEncoded, alg)
  return await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXP_TIME ?? '24h')
    .setIssuer('vai-compra')
    .setAudience('vai-compra')
    .sign(privKey)
}
