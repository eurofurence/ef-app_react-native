export function deriveProfileUrlFromMastodonHandle(handle: string) {
  // Remove the leading '@' and split the handle into username and instance
  const parts = handle.replace(/^@/, '').split('@')

  if (parts.length !== 2) {
    return undefined
  }

  const [username, instance] = parts

  // Construct the URL
  return `https://${instance}/@${username}`
}
