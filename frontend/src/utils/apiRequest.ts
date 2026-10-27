type ErrorMessages = Partial<Record<number, string>>

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
    response = await fetch(url, options)
  } catch {
    throw new Error('Unable to connect to the server. Please check your connection and try again.')
  }

  if (!response.ok) {
    throw new Error(await getResponseError(response, fallbackMessage, errorMessages))
  }

  if (response.status === 204) return undefined as T

  try {
    return await response.json() as T
  } catch {
    throw new Error('The server returned an unexpected response. Please try again.')
  }
}
