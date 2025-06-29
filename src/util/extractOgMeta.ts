const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
export function extractOgMeta(html: string) {
  const getTag = (property: string) => {
    const escapedProperty = escapeRegExp(property)
    const regex = new RegExp(
      `<meta\\s+[^>]*?(?:property|name)=["']${escapedProperty}["'][^>]*?content=["']([^"']+)["'][^>]*?>|<meta\\s+[^>]*?content=["']([^"']+)["'][^>]*?(?:property|name)=["']${escapedProperty}["'][^>]*?>`,
      'i'
    )
    const match = html.match(regex)
    return match ? (match[1] || match[2] || '').trim() : ''
  }

  const image = getTag('og:image')

  return {
    image,
  }
}
