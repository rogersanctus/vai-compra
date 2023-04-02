export class MissingEnvVariableError extends Error {
  constructor(variable: string) {
    super(`The environment variable ${variable} is not set`)
  }
}
