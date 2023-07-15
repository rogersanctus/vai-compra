import { UserNotAuthenticatedError } from './UserLoginError'

export class MissingEnvVariableError extends UserNotAuthenticatedError {
  constructor(variable: string) {
    super(`The environment variable ${variable} is not set`)
  }
}
