import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useToastContext } from '@/context/ToastContext'
import { favoriteDealersCollection } from '@/data/collections/supplemental/FavoriteDealers'

export function useFavoriteDealersToasts() {
  const { toast } = useToastContext()
  const { t } = useTranslation('Dealers')

  useEffect(() => {
    const subFavorites = favoriteDealersCollection.subscribeChanges(
      (changes) => {
        for (const change of changes) {
          if (change.type === 'insert')
            toast('info', t('favorite_added'), 3000, 'favorite', true)
          else if (change.type === 'delete')
            toast('info', t('favorite_removed'), 3000, 'favorite', true)
        }
      }
    )

    return () => {
      subFavorites.unsubscribe()
    }
  }, [])
}
