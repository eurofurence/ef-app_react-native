import { appBase } from '@/configuration'
import type { EfEventFull } from '@/data/collections/content/EventsFull'
import { shareLink } from '@/util/shareLink'

export const shareEvent = (event: Pick<EfEventFull, 'Id' | 'Title'>) =>
  shareLink(event.Title, `${appBase}/Web/Events/${event.Id}`)
