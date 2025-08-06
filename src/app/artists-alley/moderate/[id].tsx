import { Redirect, router, useLocalSearchParams } from 'expo-router'
import React, { useCallback } from 'react'
import { useArtistsAlleyItemQuery } from '@/hooks/api/artists-alley/useArtistsAlleyItemQuery'
import { StyleSheet, RefreshControl, ScrollView } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { appStyles } from '@/components/AppStyles'
import { Badge } from '@/components/generic/containers/Badge'
import { useTranslation } from 'react-i18next'
import { stateToBackground } from '@/components/artists-alley/utils'
import { ArtistsAlleyReview } from '@/components/artists-alley/ArtistsAlleyReview'
import { useArtistsAlleyItemStatusMutation } from '@/hooks/api/artists-alley/useArtistsAlleyItemStatusMutation'
import { useArtistsAlleyItemDeleteMutation } from '@/hooks/api/artists-alley/useArtistsAlleyItemDeleteMutation'
import { useToastContext } from '@/context/ui/ToastContext'
import { captureException } from '@sentry/react-native'
import { confirmPrompt } from '@/util/confirmPrompt'
import { useUserContext } from '@/context/auth/User'

export default function Moderate() {
  const { id } = useLocalSearchParams<{ id: string }>()

  const { t } = useTranslation('ArtistsAlley', { keyPrefix: 'review' })
  const { t: tStatus } = useTranslation('ArtistsAlley', { keyPrefix: 'review.status' })
  const { user } = useUserContext()

  const { mutateAsync: changeStatus } = useArtistsAlleyItemStatusMutation()
  const { mutateAsync: deleteRegistration } = useArtistsAlleyItemDeleteMutation()

  // Use toast function.
  const { toast } = useToastContext()

  const { data, isPending, refetch } = useArtistsAlleyItemQuery(id)

  const isAdmin = Boolean(user?.RoleMap?.Admin)
  const isPrivileged = isAdmin || Boolean(user?.RoleMap?.ArtistAlleyAdmin) || Boolean(user?.RoleMap?.ArtistAlleyModerator)

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

  if (!isAdmin || !isPrivileged) return <Redirect href="/artists-alley" />

  return (
    <ScrollView style={StyleSheet.absoluteFill} refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />} stickyHeaderIndices={[0]}>
      <Header>{t('title')}</Header>
      <Floater containerStyle={appStyles.trailer}>
        {!data?.State ? null : (
          <Badge unpad={padFloater} badgeColor={stateToBackground[data.State as keyof typeof stateToBackground]} textColor="white">
            {tStatus(data.State)}
          </Badge>
        )}
        {data ? <ArtistsAlleyReview data={data} canDelete={isAdmin} onAccept={doAccept} onReject={doReject} onDelete={doDelete} /> : null}
      </Floater>
    </ScrollView>
  )
}
