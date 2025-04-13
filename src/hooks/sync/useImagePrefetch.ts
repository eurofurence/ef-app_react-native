import { useEffect } from 'react'
import { Image } from 'expo-image'
import { captureException } from '@sentry/react-native'
import { Observable } from '@/util/Observable'
import { ResettableTimeout } from '@/util/ResettableTimeout'
import { useCache } from '@/context/data/Cache'

/**
 * Resettable timeout waiting for load completion.
 */
export const imagePrefetchGate = new ResettableTimeout(10_000)

/**
 * Completion state.
 */
export const imagePrefetchComplete = new Observable(false)

/**
 * Invoke when a load event is triggered on an image, pushes the prefetch
 * back to allow for priority images to load.
 */
export const onLoadEvent = () => imagePrefetchGate.reset()

export const useImagePrefetch = () => {
  const { images } = useCache() // Use your context to fetch cache

  useEffect(() => {
    if (images.length === 0) return

    // Schedule after cooldown.
    console.log('Scheduling prefetch')

    // Reset completion, images might have changed.
    imagePrefetchComplete.value = false
    imagePrefetchGate.setHandle(() => {
      // Log that gate let trigger through.
      console.log('Prefetch triggered')

      // Start the prefetch.
      Image.prefetch(
        images.map((item) => item.Url),
        'memory-disk'
      )
        .catch(captureException)
        .finally(() => {
          // Mark disconnect.
          console.log('Completed, disconnecting')

          // Completed, deactivate gate's connection to the handler
          // and set completion to true.
          imagePrefetchGate.clearHandle()
          imagePrefetchComplete.value = true
        })
    })

    return () => {
      // Hook not used anymore, disconnect handler.
      imagePrefetchGate.clearHandle()
    }
  }, [images]) // Re-run this effect when images change
}
