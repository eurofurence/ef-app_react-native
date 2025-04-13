/**
 * A URL leading to an image.
 */
import { ImageRecord } from '@/context/data/types.api'

export type ArtistAlleyOwnTableRegistrationRecord = {
  LastChangeDateTimeUtc: string
  Id: string
  CreatedDateTimeUtc: string
  OwnerUid: string
  OwnerUsername: string
  DisplayName: string
  WebsiteUrl: string
  ShortDescription: string
  TelegramHandle: string
  Location: string
  ImageId: string
  Image: ImageRecord
  State: string
}
