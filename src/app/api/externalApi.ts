const API_URL = process.env.EXTERNAL_API_URL

export async function fetchOnApi(path: string, requestInit?: RequestInit) {
  if (!API_URL) {
    return Promise.reject('API_URL environment variable is missing.')
  }

  const url = new URL(path, API_URL)
  return fetch(url, requestInit)
}
