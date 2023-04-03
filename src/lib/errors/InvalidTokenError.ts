export class InvalidTokenError extends Error {
  constructor(private reason: unknown) {
    super(
      JSON.stringify({
        error: {
          message: 'Invalid Token',
          reason
        }
      })
    )
  }
}
