import { apiBase } from '@/configuration'
import { ArtistAlleyPostTableRegistrationData } from '@/hooks/api/artist-alley/ArtistAlleyPostTableRegistrationData'
import axios from 'axios'

/**
 * Posts a table registration via the API with the given access token and registration data.
 * @param accessToken The access token.
 * @param data The registration data.
 */
export async function postArtistAlleyPostTableRegistrationRequest(accessToken: string | null, data: ArtistAlleyPostTableRegistrationData) {
  if (!accessToken) throw new Error('Unauthorized')

  const requestImageFile = await fetch(data.imageUri).then(async (response) => {
    const contentType = response.headers.get('Content-type') ?? 'image/jpeg'
    const extension = contentType.split('/')[1].split(';')[0]
    const fileName = 'input.' + extension

    return new File([await response.blob()], fileName, {
      type: contentType,
      lastModified: Date.now(),
    })
  })

  const form = new FormData()
  form.append('requestImageFile', requestImageFile)
  form.append('DisplayName', data.displayName)
  form.append('WebsiteUrl', data.websiteUrl)
  form.append('ShortDescription', data.shortDescription)
  form.append('Location', data.location)
  form.append('TelegramHandle', data.telegramHandle)

  await axios.post(`${apiBase}/ArtistsAlley/TableRegistrationRequest`, form, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return true
}
