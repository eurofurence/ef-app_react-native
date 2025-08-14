import * as FileSystem from 'expo-file-system'
import { FileSystemSessionType, FileSystemUploadType } from 'expo-file-system'

import { apiBase } from '@/configuration'
import { ArtistsAlleyPostTableRegistrationData } from '@/hooks/api/artists-alley/ArtistsAlleyPostTableRegistrationData'

/**
 * Posts a table registration via the API with the given access token and registration data.
 * @param accessToken The access token.
 * @param data The registration data.
 */
export async function postArtistsAlleyPostTableRegistrationRequest(accessToken: string | null, data: ArtistsAlleyPostTableRegistrationData) {
  if (!accessToken) throw new Error('Unauthorized')

  // Check if uploading a new image or an existing. If existing, download.
  let downloadedUri
  if (data.imageUri.startsWith('file:')) {
    downloadedUri = null
  } else {
    const fileName = data.imageUri.substring(data.imageUri.lastIndexOf('/') + 1)
    downloadedUri = FileSystem.cacheDirectory + fileName
    await FileSystem.downloadAsync(data.imageUri, downloadedUri, {
      sessionType: FileSystemSessionType.FOREGROUND,
    })
  }

  try {
    // Upload to registration. Return true.
    await FileSystem.uploadAsync(`${apiBase}/ArtistsAlley/TableRegistrationRequest`, downloadedUri ?? data.imageUri, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      httpMethod: 'POST',
      sessionType: FileSystemSessionType.FOREGROUND,
      uploadType: FileSystemUploadType.MULTIPART,
      fieldName: 'requestImageFile',
      parameters: {
        DisplayName: data.displayName,
        WebsiteUrl: data.websiteUrl,
        ShortDescription: data.shortDescription,
        Location: data.location,
        TelegramHandle: data.telegramHandle,
      },
    }).then((res) => {
      // OK-ish status code, API will likely return 200 or 202.
      if (200 <= res.status && res.status < 300) return res.body
      else throw new Error(`Response ${res.status} with body: ${res.body}`)
    })

    return true
  } finally {
    // Clean up if a temporary file was downloaded.
    if (downloadedUri) {
      await FileSystem.deleteAsync(downloadedUri)
    }
  }
}
