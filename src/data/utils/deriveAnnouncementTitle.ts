export function deriveAnnouncementTitle(title: string, content: string) {
  // Not ellipsized, skip.
  if (!title.endsWith('[...]')) return title

  // Get init of title without hard ellipses. If that's not the start of the
  // content, something else happened, skip.
  const init = title.substring(0, title.length - 5)
  if (!content.startsWith(init)) return title

  // Check the longest full sentence to be extracted. Use if present.
  const index = Math.max(
    init.indexOf('.'),
    init.indexOf('!'),
    init.indexOf('?'),
    init.indexOf('\n')
  )
  if (index < 0) return init
  return init.substring(0, index + 1)
}
