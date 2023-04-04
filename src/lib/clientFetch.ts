'use client'

const unauthorized_status = [401, 403]

function clearAndReloadIfNeeded() {
  if (sessionStorage.getItem('user')) {
    sessionStorage.removeItem('isLoggedIn')
    sessionStorage.removeItem('user')
    window.location.reload()
  }
}

export async function clientFetch(path: string, init?: RequestInit) {
  const headers = (init?.headers ?? {}) as Record<string, string>
  const clientPathname = window.location.pathname

  headers['x-from-pathname'] = clientPathname

  const response = await fetch(path, {
    ...init,
    headers
  })

  if (!response.ok && unauthorized_status.includes(response.status)) {
    clearAndReloadIfNeeded()
  }

  return response
}
