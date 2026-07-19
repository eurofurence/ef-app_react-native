import type {IconNames} from "@/components/generic/atoms/Icon";

export function deriveIconFromTags(
  tags: string[] | null | undefined
): IconNames | undefined {
  if (!tags) return
  if (tags.includes('supersponsors_only')) return 'star-circle'
  if (tags.includes('sponsors_only')) return 'star'
  if (tags.includes('ticketed')) return 'ticket'
  if (tags.includes('kage')) return 'bug'
  if (tags.includes('art_show')) return 'image-frame'
  if (tags.includes('dealers_den')) return 'shopping'
  if (tags.includes('main_stage')) return 'bank'
  if (tags.includes('photoshoot')) return 'camera'
}
