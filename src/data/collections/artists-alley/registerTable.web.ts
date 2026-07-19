import axios from 'axios'

import { apiBase } from '@/configuration'
import { auth } from '@/data/clients/auth'
import type { EfRegisterTable } from '@/data/types/EfRegisterTable'

/**
 * Posts a table registration via the API with the given access token and registration data.
 * @param data The registration data.
 */
export async function registerTable(
  data: EfRegisterTable
) {
  const accessToken = auth.state.tokenResponse?.accessToken
  if (!accessToken) throw new Error('Unauthorized')

  const requestImageFile = await fetch(data.imageUri).then(async (response) => {
    const contentType = response.headers.get('Content-type') ?? 'image/jpeg'
    const extension = contentType.split('/')[1].split(';')[0]
    const fileName = `input.${extension}`

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
