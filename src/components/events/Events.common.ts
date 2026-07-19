import type {EfEventFull} from "@/data/collections/content/EventsFull";
import { captureException } from '@sentry/react-native'
import { Share } from 'react-native'

import { appBase, conAbbr } from '@/configuration'

export const shareEvent = (event: Pick<EfEventFull, 'Id' | 'Title'>) =>
  Share.share(
    {
      title: event.Title,
      url: `${appBase}/Web/Events/${event.Id}`,
      message: `Check out ${event.Title} on ${conAbbr}!\n${appBase}/Web/Events/${event.Id}`,
    },
    {}
  ).catch(captureException)
