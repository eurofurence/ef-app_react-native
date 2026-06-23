/** EF WiFi contract — mirrored from wifisetup-html for parity. Security-critical: NOT overridable by deeplinks. */
export const WIFI_SSID = 'Eurofurence'
export const WIFI_ANONYMOUS_IDENTITY = 'anonymous'
export const WIFI_DOMAIN_SUFFIX_MATCH = 'radius.eurofurence.org'

export const WIFI_PROFILE_IDS = [
  'eurofurence',
  'event',
  'public',
  'custom',
] as const
export type WifiProfileId = (typeof WIFI_PROFILE_IDS)[number]

export const WIFI_PUBLIC_PROFILE_IDS = [
  'eurofurence',
  'public',
  'event',
] as const

export type WifiCredentials = { identity: string; password: string }

/** Printable ASCII (incl. space), 1..128 chars. Blocks control chars / overlong injection payloads. */
const CREDENTIAL_RE = /^[\x20-\x7e]{1,128}$/

export function isValidCredential(value: unknown): value is string {
  return typeof value === 'string' && CREDENTIAL_RE.test(value)
}

export function credentialsForProfile(
  profile: WifiProfileId,
  custom?: WifiCredentials
): WifiCredentials | null {
  if (profile === 'custom') {
    if (
      custom &&
      isValidCredential(custom.identity) &&
      isValidCredential(custom.password)
    ) {
      return { identity: custom.identity, password: custom.password }
    }
    return null
  }
  // Fixed public profiles use the profile id as both identity and password.
  return { identity: profile, password: profile }
}

export function isPublicProfile(
  profile: string
): profile is (typeof WIFI_PUBLIC_PROFILE_IDS)[number] {
  return (WIFI_PUBLIC_PROFILE_IDS as readonly string[]).includes(profile)
}

export type ParsedWifiLink =
  | { profile: 'custom'; identity: string; password: string }
  | { profile: (typeof WIFI_PUBLIC_PROFILE_IDS)[number] }

/**
 * Parse a wifi deeplink/QR payload. SECURITY: only `id`/`pw` (custom creds) and an optional
 * public `profile` are honoured. SSID, EAP, CA, host and any other params are ignored so a
 * malicious link/QR can never reconfigure the network or point at a rogue server.
 */
export function parseWifiUrl(raw: string): ParsedWifiLink | null {
  if (typeof raw !== 'string' || raw.length > 2048) return null
  // Strip any URL fragment first: a '#...' fragment is not part of the query and
  // URLSearchParams would otherwise fold it into the last param value.
  const noFragment =
    raw.indexOf('#') >= 0 ? raw.slice(0, raw.indexOf('#')) : raw
  const q = noFragment.indexOf('?')
  const params = new URLSearchParams(q >= 0 ? noFragment.slice(q + 1) : '')

  const id = params.get('id')
  const pw = params.get('pw')
  if (id !== null && pw !== null) {
    if (!isValidCredential(id) || !isValidCredential(pw)) return null
    return { profile: 'custom', identity: id, password: pw }
  }

  const profile = params.get('profile')
  if (profile !== null && isPublicProfile(profile)) return { profile }

  return null
}

/** Onsite WiFi setup page (wifi.onsite.eurofurence.org) — a static site that generates an UNSIGNED .mobileconfig client-side. */
export const WIFI_ONSITE_URL = 'https://wifi.onsite.eurofurence.org'

/**
 * Build the onsite page URL pre-filled with credentials. On iOS the app opens this in Safari and
 * the page generates an unsigned .mobileconfig to install. Public profiles are identity === password
 * === profile id, so this single shape covers every profile.
 */
export function buildOnsiteProfileUrl(
  identity: string,
  password: string
): string {
  const params = new URLSearchParams({ id: identity, pw: password })
  return `${WIFI_ONSITE_URL}/?${params.toString()}`
}

/**
 * Build a DIRECT URL to a pre-filled, statically-hosted .mobileconfig for a PUBLIC profile.
 * Opening it in Safari triggers the iOS install prompt in one step (no tutorial-page tap).
 * Custom credentials can't be static, so those use buildOnsiteProfileUrl (the prefilled page).
 */
export function buildOnsiteFileUrl(
  profile: (typeof WIFI_PUBLIC_PROFILE_IDS)[number]
): string {
  return `${WIFI_ONSITE_URL}/ios-profile-${profile}/`
}
