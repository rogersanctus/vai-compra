interface CookieOption {
  secure: boolean
  sameSite: 'strict' | 'lax' | 'none'
  httpOnly: boolean
}

export const sessionOptions: CookieOption = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  httpOnly: true
}
