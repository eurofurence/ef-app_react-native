export function deriveHosts(panelHosts: string | undefined) {
  return (
    panelHosts
      ?.split(',')
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  )
}
