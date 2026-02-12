import { captureException } from '@sentry/react-native'
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
import { useUserContext } from '@/context/auth/User'
import { useToastContext } from '@/context/ui/ToastContext'
import { useArtistsAlleyItemDeleteMutation } from '@/hooks/api/artists-alley/useArtistsAlleyItemDeleteMutation'
import { useArtistsAlleyItemQuery } from '@/hooks/api/artists-alley/useArtistsAlleyItemQuery'
import { useArtistsAlleyItemStatusMutation } from '@/hooks/api/artists-alley/useArtistsAlleyItemStatusMutation'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { confirmPrompt } from '@/util/confirmPrompt'

export default function Moderate() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'review' })
  const { t: tStatus } = useTranslation('ArtistsAlley', {
    keyPrefix: 'review.status',
  })
  const { t: a11y } = useTranslation('ArtistsAlley', {
    keyPrefix: 'accessibility',
  })
  const { user } = useUserContext()

  const { mutateAsync: changeStatus } = useArtistsAlleyItemStatusMutation()
  const { mutateAsync: deleteRegistration } =
    useArtistsAlleyItemDeleteMutation()

  // Use toast function.
  const { toast } = useToastContext()

  const { data, isPending, refetch } = useArtistsAlleyItemQuery(id)
  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)

  const isAdmin = Boolean(user?.RoleMap?.Admin)
  const isPrivileged =
    isAdmin ||
    Boolean(user?.RoleMap?.ArtistAlleyAdmin) ||
    Boolean(user?.RoleMap?.ArtistAlleyModerator)

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
      await changeStatus({ id: id, status: 'Accepted' })
      toast('info', t('accept_succeeded'), 6000)
    } catch (error) {
      toast('error', t('accept_failed'), 6000)
      captureException(error)
    }
  }, [changeStatus, id, t, toast])

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
      await changeStatus({ id: id, status: 'Rejected' })
      toast('info', t('reject_succeeded'), 6000)
    } catch (error) {
      toast('error', t('reject_failed'), 6000)
      captureException(error)
    }
  }, [changeStatus, id, t, toast])

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
      await deleteRegistration(id)
      toast('info', t('delete_succeeded'), 6000)
      router.navigate('/artists-alley')
    } catch (error) {
      toast('error', t('delete_failed'), 6000)
      captureException(error)
    }
  }, [deleteRegistration, id, t, toast])

  if (!(isAdmin || isPrivileged)) return <Redirect href='/artists-alley' />

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <ScrollView
        style={StyleSheet.absoluteFill}
        refreshControl={
          <RefreshControl refreshing={isPending} onRefresh={refetch} />
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
