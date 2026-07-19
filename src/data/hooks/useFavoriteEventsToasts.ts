import {useToastContext} from "@/context/ToastContext";
import {favoriteEventsCollection} from "@/data/collections/supplemental/FavoriteEvents";
import {useTranslation} from "react-i18next";
import {useEffect} from "react"

export function useFavoriteEventsToasts() {
  const {toast} = useToastContext()
  const {t} = useTranslation('Events')

  useEffect(() => {
    const subFavorites = favoriteEventsCollection.subscribeChanges(changes => {
      for (const change of changes) {
        if (change.type === 'insert')
          toast('info', t('favorite_added'), 3000, 'favorite', true)
        else if (change.type === 'delete')
          toast('info', t('favorite_removed'), 3000, 'favorite', true)
      }
    })

    return () => {
      subFavorites.unsubscribe()
    }
  }, []);

}
