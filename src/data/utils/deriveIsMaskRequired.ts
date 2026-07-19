export function deriveIsMaskRequired(tags: string[] | null | undefined) {
  return Boolean(tags?.includes('mask_required'))
}
