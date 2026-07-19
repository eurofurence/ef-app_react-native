import {useAppSetting} from "@/data/collections/supplemental/AppSettings";
import type {EfRegisterTableLocal} from "@/data/types/EfRegisterTableLocal";
import {useCallback, useMemo} from 'react'

/**
 * Uses locally stored artists alley registration info to be used for repeat registrations.
 */
export function useArtistsAlleyLocalData() {
  const [displayName, setDisplayName] = useAppSetting('ArtistsAlleyDisplayName')
  const [websiteUrl, setWebsiteUrl] = useAppSetting('ArtistsAlleyWebsiteUrl')
  const [shortDescription, setShortDescription] = useAppSetting('ArtistsAlleyShortDescription')
  const [telegramHandle, setTelegramHandle] = useAppSetting('ArtistsAlleyTelegramHandle')

  const value = useMemo(() => ({
    DisplayName: displayName,
    WebsiteUrl: websiteUrl,
    ShortDescription: shortDescription,
    TelegramHandle: telegramHandle,
  } satisfies EfRegisterTableLocal), [displayName, websiteUrl, shortDescription, telegramHandle])

  const update = useCallback((data: EfRegisterTableLocal) => {
    setDisplayName(data.DisplayName)
    setWebsiteUrl(data.WebsiteUrl)
    setShortDescription(data.ShortDescription)
    setTelegramHandle(data.TelegramHandle)
  }, [setDisplayName, setWebsiteUrl, setShortDescription, setTelegramHandle])

  return [value, update] as const
}
