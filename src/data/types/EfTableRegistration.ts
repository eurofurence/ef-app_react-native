import type { EfEntity } from '@/data/types/EfEntity'
import type { EfId } from '@/data/types/EfId'
import type { EfImage } from '@/data/types/EfImage'

export type EfTableRegistrationStatus =
  | 'Pending'
  | 'Accepted'
  | 'Published'
  | 'Rejected'
  | 'CheckedOut'

export type EfTableRegistration = EfEntity & {
  CreatedDateTimeUtc: string
  OwnerUid: string
  OwnerUsername: string
  OwnerRegSysId: string
  DisplayName: string
  WebsiteUrl: string
  ShortDescription: string
  TelegramHandle: string
  Location: string
  ImageId?: EfId
  Image?: EfImage
  State: EfTableRegistrationStatus
}
