type ErrorMessages = Partial<Record<number, string>>

export const unauthorizedEvent = 'warrantykeep:unauthorized'

const configuredApiBaseUrl = import.meta.env?.VITE_API_BASE_URL?.trim().replace(/\/+$/, '') ?? ''

if (configuredApiBaseUrl) {
  const parsedApiUrl = new URL(configuredApiBaseUrl)
  if (!['http:', 'https:'].includes(parsedApiUrl.protocol) || parsedApiUrl.origin !== configuredApiBaseUrl) {
    throw new Error('VITE_API_BASE_URL must be an origin without a path.')
  }
  if (import.meta.env?.PROD && parsedApiUrl.protocol !== 'https:') {
    throw new Error('VITE_API_BASE_URL must use HTTPS in production.')
  }
}

const getApiUrl = (url: string) => configuredApiBaseUrl && url.startsWith('/api')
  ? `${configuredApiBaseUrl}${url}`
  : url

const getResponseError = async (
  response: Response,
  fallbackMessage: string,
  errorMessages: ErrorMessages
): Promise<string> => {
  try {
    const data: unknown = await response.json()
    if (data && typeof data === 'object' && 'error' in data &&
      typeof data.error === 'string' && data.error.trim()) {
      return data.error.trim()
    }
  } catch {
    // Proxies and unavailable servers may return an empty or non-JSON response.
  }

  const statusMessage = errorMessages[response.status]
  if (statusMessage) return statusMessage

  switch (response.status) {
    case 401:
      return 'Your session is invalid or has expired. Please log in again.'
    case 403:
      return 'You do not have permission to perform this action.'
    case 429:
      return 'Too many requests. Please wait and try again.'
    default:
      return fallbackMessage
  }
}

export const apiRequest = async <T>(
  url: string,
  options: RequestInit,
  fallbackMessage: string,
  errorMessages: ErrorMessages = {}
): Promise<T> => {
  let response: Response

  try {
    response = await fetch(getApiUrl(url), { ...options, credentials: 'omit', cache: 'no-store' })
  } catch {
    throw new Error('Unable to connect to the server. Please check your connection and try again.')
  }

  if (!response.ok) {
    if (response.status === 401 && new Headers(options.headers).has('Authorization')) {
      const token = new Headers(options.headers).get('Authorization')?.replace(/^Bearer /i, '')
      window.dispatchEvent(new CustomEvent(unauthorizedEvent, { detail: { token } }))
    }
    throw new Error(await getResponseError(response, fallbackMessage, errorMessages))
  }

  if (response.status === 204) return undefined as T

  try {
    return await response.json() as T
  } catch {
    throw new Error('The server returned an unexpected response. Please try again.')
  }
}
