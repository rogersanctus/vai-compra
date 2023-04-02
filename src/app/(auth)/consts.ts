const envMinPasswordLength = process.env.NEXT_PUBLIC_MIN_PASSWORD_LENGTH

export const MIN_PASSWORD_LENGTH = envMinPasswordLength
  ? Number(envMinPasswordLength)
  : 4

export const LoginErrorReasons = {
  user_not_found: 'Usuário não encontrado',
  wrong_password: 'Senha inválida'
}
