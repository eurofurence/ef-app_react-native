export function isAuthError(error: unknown): error is Error {
  return Boolean(
    error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 401
  )
}

export function isTokenError(error: unknown): error is Error {
  return (
    error instanceof Error &&
    (error.message.includes('Token is inactive') ||
      error.message.includes('malformed') ||
      error.message.includes('expired') ||
      error.message.includes('invalid') ||
      error.message.includes('Token validation failed'))
  )
}
