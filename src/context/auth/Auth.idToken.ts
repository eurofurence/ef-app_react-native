import { Buffer } from 'buffer'

/**
 * Identity token data.
 */
export type IdData = Partial<{
  at_hash: string
  aud: string[]
  auth_time: number
  avatar: string
  exp: number
  iat: number
  iss: string
  jti: string
  name: string
  rat: number
  sid: string
  sub: string
}>

/**
 * Parses a JWT without validating it.
 * @param data The data to parse.
 */
export function parseIdToken(data: string): IdData | null {
  const separatorStart = data.indexOf('.')
  if (separatorStart < 0) return null
  const separatorEnd = data.indexOf('.', separatorStart + 1)
  if (separatorEnd < 0) return null
  const dataPart = data.substring(separatorStart + 1, separatorEnd)
  try {
    return JSON.parse(Buffer.from(dataPart, 'base64').toString())
  } catch {
    return null
  }
}
