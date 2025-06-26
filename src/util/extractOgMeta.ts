export function extractOgMeta(html: string) {
  const getTag = (property: string) => {
    const regex = new RegExp(
      `<meta\\s+[^>]*?(?:property|name)=["']${property}["'][^>]*?content=["']([^"']+)["'][^>]*?>|<meta\\s+[^>]*?content=["']([^"']+)["'][^>]*?(?:property|name)=["']${property}["'][^>]*?>`,
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
