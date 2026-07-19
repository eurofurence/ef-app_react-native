export function deriveIsSuperSponsorsOnly(tags: string[] | null | undefined) {
  return Boolean(tags?.includes('supersponsors_only'));
}
