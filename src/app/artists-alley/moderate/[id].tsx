import { captureException } from '@sentry/react-native'
import { eq, useLiveQuery } from '@tanstack/react-db'
import { Redirect, router, useLocalSearchParams } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { appStyles } from '@/components/AppStyles'
import { ArtistsAlleyReview } from '@/components/artists-alley/ArtistsAlleyReview'
import { stateToBackground } from '@/components/artists-alley/utils'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Badge } from '@/components/generic/containers/Badge'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useToastContext } from '@/context/ToastContext'
import { useAuthState } from '@/data/clients/auth'
import { inRole } from '@/data/clients/auth.utils'
import {
  artistsAlleyAdminChangeStatus,
  artistsAlleyAdminCollection,
  artistsAlleyAdminDelete,
} from '@/data/collections/artists-alley/ArtistsAlleyAdmin'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { confirmPrompt } from '@/util/confirmPrompt'
import { vibrateAfter } from '@/util/vibrateAfter'

export default function Moderate() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'review' })
  const { t: tStatus } = useTranslation('ArtistsAlley', {
    keyPrefix: 'review.status',
  })
  const { t: a11y } = useTranslation('ArtistsAlley', {
    keyPrefix: 'accessibility',
  })
  const { user } = useAuthState()

  // Use toast function.
  const { toast } = useToastContext()

  const { data, isLoading } = useLiveQuery(
    {
      id: 'artists-alley-moderate-item',
      query: (q) =>
        q
          .from({ item: artistsAlleyAdminCollection })
          .where(({ item }) => eq(item.Id, id))
          .findOne(),
    },
    [id]
  )

  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)

  const isAdmin = inRole(user, 'Admin')
  const isPrivileged =
    isAdmin ||
    inRole(user, 'ArtistAlleyAdmin') ||
    inRole(user, 'ArtistAlleyModerator')

  useEffect(() => {
    if (data) {
      setAnnouncementMessage(
        a11y('moderation_entry_loaded', {
          name: data.DisplayName,
          status: data.State,
        })
      )
    } else {
      setAnnouncementMessage(a11y('moderation_entry_not_found'))
    }
  }, [data, a11y])

  // TODO: Relatively common pattern.
  const doAccept = useCallback(async () => {
    try {
      if (
        (await confirmPrompt({
          title: t('confirm_choice'),
          body: t('choice_accept'),
          confirmText: t('confirm'),
          cancelText: t('cancel'),
        })) !== true
      )
        return

      toast('notice', t('accept_in_progress'))
      await artistsAlleyAdminChangeStatus(id, 'Accepted')
      toast('info', t('accept_succeeded'), 6000)
    } catch (error) {
      toast('error', t('accept_failed'), 6000)
      captureException(error)
    }
  }, [id, t, toast])

  const doReject = useCallback(async () => {
    try {
      if (
        (await confirmPrompt({
          title: t('confirm_choice'),
          body: t('choice_reject'),
          confirmText: t('confirm'),
          cancelText: t('cancel'),
        })) !== true
      )
        return
      toast('notice', t('reject_in_progress'))
      await artistsAlleyAdminChangeStatus(id, 'Rejected')
      toast('info', t('reject_succeeded'), 6000)
    } catch (error) {
      toast('error', t('reject_failed'), 6000)
      captureException(error)
    }
  }, [id, t, toast])

  const doDelete = useCallback(async () => {
    try {
      if (
        (await confirmPrompt({
          title: t('confirm_choice'),
          body: t('choice_delete'),
          deleteText: t('delete'),
          cancelText: t('cancel'),
        })) !== true
      )
        return
      toast('notice', t('delete_in_progress'))
      await artistsAlleyAdminDelete(id)
      toast('info', t('delete_succeeded'), 6000)
      router.navigate('/artists-alley')
    } catch (error) {
      toast('error', t('delete_failed'), 6000)
      captureException(error)
    }
  }, [id, t, toast])

  if (!(isAdmin || isPrivileged)) return <Redirect href='/artists-alley' />

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <ScrollView
        style={StyleSheet.absoluteFill}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() =>
              vibrateAfter(artistsAlleyAdminCollection.utils.refetch())
            }
          />
        }
        stickyHeaderIndices={[0]}
        accessibilityLabel={a11y('moderation_entry_scroll')}
        accessibilityHint={a11y('moderation_entry_scroll_hint')}
      >
        <Header>{t('title')}</Header>
        <Floater containerStyle={appStyles.trailer}>
          <View
            ref={mainContentRef}
            accessibilityLabel={a11y('moderation_entry_content')}
            accessibilityRole='text'
          >
            {!data?.State ? null : (
              <Badge
                unpad={padFloater}
                badgeColor={
                  stateToBackground[
                    data.State as keyof typeof stateToBackground
                  ]
                }
                textColor='white'
              >
                {tStatus(data.State)}
              </Badge>
            )}
            {data ? (
              <ArtistsAlleyReview
                data={data}
                canDelete={isAdmin}
                onAccept={doAccept}
                onReject={doReject}
                onDelete={doDelete}
              />
            ) : null}
          </View>
        </Floater>
      </ScrollView>
    </>
  )
}
