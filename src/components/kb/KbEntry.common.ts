import { appBase } from '@/configuration'
import type { EfKbEntry } from '@/data/types/EfKbEntry'
import { shareLink } from '@/util/shareLink'

//todo
export const shareKbEntry = (entry: Pick<EfKbEntry, 'Title' | 'Id'>) =>
  shareLink(entry.Title, `${appBase}/Web/KnowledgeEntries/${entry.Id}`)
