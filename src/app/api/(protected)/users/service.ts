import { MissingEnvVariableError } from '@/lib/errors/MissingEnvVariableError'
import { importSPKI, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'

export async function getUserIdFromSession(request: NextRequest) {
  const authSession = request.cookies.get('auth-session')

  if (!authSession) {
    throw new Error('Auth session is missing')
  }

  if (!process.env.JWT_PUB_KEY) {
    throw new MissingEnvVariableError('JWT_PUB_KEY')
  }

  if (!process.env.RSA_ALG) {
    throw new MissingEnvVariableError('RSA_ALG')
  }

  const pkey = await importSPKI(process.env.JWT_PUB_KEY, process.env.RSA_ALG)

  const { payload } = await jwtVerify(authSession.value, pkey)

  return payload.id as number
}
