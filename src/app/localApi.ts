import { headers } from 'next/headers'

export async function localFetch(path: string, init?: RequestInit) {
  const protocol = 'http'
  const headersList = headers()
  const url = headersList.get('host') || ''
  const fullUrl = new URL(path, `${protocol}://${url}`)

  return await fetch(fullUrl, {
    ...init,
    headers: headersList
  })
}
