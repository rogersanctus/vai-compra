import { LoginErrorReasons } from '@/app/(auth)/consts'

export class UserLoginError extends Error {
  reason: keyof typeof LoginErrorReasons | undefined = undefined

  constructor(reason: keyof typeof LoginErrorReasons | undefined) {
    super(`Access denied. Reason ${reason}`)
    this.reason = reason
  }
}

export function getLoginErrorMessage(
  reason: keyof typeof LoginErrorReasons | undefined
) {
  if (reason && reason in LoginErrorReasons) {
    return LoginErrorReasons[reason]
  }

  return 'Usuário ou senha inválidos'
}
