import type { IconNames } from '@/components/generic/atoms/Icon'

export function deriveBadgesFromTags(
  tags: string[] | null | undefined
): IconNames[] | undefined {
  if (!tags) return []

  const badges: IconNames[] = []
  if (tags.includes('mask_required')) badges.push('face-mask')
  return badges
}
