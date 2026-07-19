import type { ThemeName } from '@/context/Theme'

export type EfAppSettings = {
  Theme: ThemeName | null
  AnalyticsEnabled: boolean
  Language: string | null
  DevMenuEnabled: boolean
  TimeTravelEnabled: boolean
  TimeTravelOffset: number
  ShowInternalEvents: boolean
  WarningsHidden: Record<string, boolean>
  ArtistsAlleyDisplayName: string | null
  ArtistsAlleyWebsiteUrl: string | null
  ArtistsAlleyShortDescription: string | null
  ArtistsAlleyTelegramHandle: string | null
}
