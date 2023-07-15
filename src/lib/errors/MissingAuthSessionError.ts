import { UserNotAuthenticatedError } from './UserLoginError'

export class MissingAuthSessionError extends UserNotAuthenticatedError {
  constructor() {
    super('The auth session is missing')
  }
}
