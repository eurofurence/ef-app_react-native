export function deriveIsSponsorsOnly(tags: string[] | null | undefined) {
  return Boolean(tags?.includes('sponsors_only'));
}
