/** Replace sensitive query-param values (id/pw/token/password) with REDACTED. Keeps WiFi creds out of telemetry. */
export function redactSensitiveUrl<T>(url: T): T {
  if (typeof url !== 'string') return url
  return url.replace(
    /([?&])(id|pw|token|password)=[^&#]*/gi,
    (_m, sep, key) => `${sep}${key}=REDACTED`
  ) as T
}
