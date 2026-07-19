import type { EfEntity } from '@/data/types/EfEntity'

export type EfPm = EfEntity & {
  RecipientRegSysId: string
  RecipientIdentityId: string
  SenderUid: string
  CreatedDateTimeUtc: string
  ReceivedDateTimeUtc: string
  ReadDateTimeUtc: string
  AuthorName: string
  Subject: string
  Message: string
}
