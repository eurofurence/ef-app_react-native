import { shareLink } from '@/util/shareLink'

//todo
export const shareKbEntry = (entry: Pick<KB blablabla, 'Title'|'Id'>) =>
  shareLink(entry.Title, `${appBase}/Web/KnowledgeEntries/${entry.Id}`)
