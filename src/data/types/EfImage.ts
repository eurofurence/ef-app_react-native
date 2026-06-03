import type { EfEntity } from './EfEntity.ts'

export type EfImage = EfEntity & {
  InternalReference: string
  Width: number
  Height: number
  SizeInBytes: number
  MimeType: string
  ContentHashSha1: string
  Url: string
  IsRestricted: boolean
  BlurHash: string
}
