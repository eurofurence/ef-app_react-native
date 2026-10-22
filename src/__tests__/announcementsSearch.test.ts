import { describe, expect, test } from 'bun:test'
import Fuse from 'fuse.js'

import type { AnnouncementDetails } from '@/context/data/types.details'
import {
  announcementsSearchProperties,
  searchOptions,
} from '@/context/data/useCacheExtensions.searching'

const announcement = (
  fields: Partial<AnnouncementDetails>
): AnnouncementDetails =>
  ({
    Id: fields.Title ?? 'id',
    NormalizedTitle: fields.Title ?? '',
    Content: '',
    Area: '',
    Author: '',
    ...fields,
  }) as AnnouncementDetails

const announcements = [
  announcement({
    Title: 'Dealers Den closing early',
    Content: 'The den shuts at 17:00 today.',
    Area: 'Dealers',
    Author: 'Operations',
  }),
  announcement({
    Title: 'Fursuit parade lineup',
    Content: 'Line up at the main stage entrance.',
    Area: 'Events',
    Author: 'Stage Crew',
  }),
  announcement({
    Title: 'Lost badge returned',
    Content: 'Collect it at the info desk.',
    Area: 'Info',
    Author: 'Reception',
  }),
]

const index = new Fuse(
  announcements,
  searchOptions,
  Fuse.createIndex(announcementsSearchProperties, announcements)
)

const titlesFor = (query: string) =>
  index.search(query).map((result) => result.item.Title)

describe('announcements search', () => {
  test('matches on title', () => {
    expect(titlesFor('parade')).toEqual(['Fursuit parade lineup'])
  })

  test('matches on content', () => {
    expect(titlesFor('info desk')).toEqual(['Lost badge returned'])
  })

  test('matches on area and author', () => {
    expect(titlesFor('Operations')).toEqual(['Dealers Den closing early'])
    expect(titlesFor('Events')).toEqual(['Fursuit parade lineup'])
  })

  test('ranks a title match above a content-only match', () => {
    expect(titlesFor('den')[0]).toBe('Dealers Den closing early')
  })

  test('returns nothing when no announcement matches', () => {
    expect(titlesFor('zzzznomatch')).toEqual([])
  })
})
