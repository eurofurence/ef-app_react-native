import { appStyles } from '@/components/AppStyles'
import { useArtistsAlleyLocalData } from '@/components/artists-alley/ArtistsAlley.common'
import { ArtistsAlleyEdit } from '@/components/artists-alley/ArtistsAlleyEdit'
import { ArtistsAlleyStatus } from '@/components/artists-alley/ArtistsAlleyStatus'
import { Label } from '@/components/generic/atoms/Label'
import { Badge } from '@/components/generic/containers/Badge'
import { Button } from '@/components/generic/containers/Button'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { artistAlleyUrl } from '@/configuration'
import { useUserContext } from '@/context/auth/User'
import { useToastContext } from '@/context/ui/ToastContext'
import { useArtistsAlleyCheckOutMutation } from '@/hooks/api/artists-alley/useArtistsAlleyCheckOutMutation'
import { useArtistsAlleyOwnRegistrationQuery } from '@/hooks/api/artists-alley/useArtistsAlleyOwnRegistrationQuery'
import { Redirect, router } from 'expo-router'
import { useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, RefreshControl, ScrollView, StyleSheet, View } from 'react-native'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { confirmPrompt } from '@/util/confirmPrompt'
import { captureException } from '@sentry/react-native'

const stateToBackground = {
  Pending: 'warning',
  Accepted: 'primary',
  Published: 'primary',
  Rejected: 'notification',
} as const

export default function Register() {
  const { t } = useTranslation('ArtistsAlley')
  const { t: tStatus } = useTranslation('ArtistsAlley', { keyPrefix: 'status' })
  const { t: a11y } = useTranslation('ArtistsAlley', { keyPrefix: 'accessibility' })

  // Get user data for RBAC checks and pre-filling.
  const { claims, user } = useUserContext()

  // Get roles for preemptive RBAC.
  const isCheckedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)

  // Get current registration if available. Only run when authorized.
  const { data, isPending, refetch } = useArtistsAlleyOwnRegistrationQuery()
  const { mutate: checkOut } = useArtistsAlleyCheckOutMutation()
  const { localData } = useArtistsAlleyLocalData()
  const { toast } = useToastContext()

  // Switch for show and edit modes.
  const [show, setShow] = useState(true)
  const [announcementMessage, setAnnouncementMessage] = useState<string>('')
  const mainContentRef = useAccessibilityFocus<View>(200)

  const onEdit = useCallback(() => setShow(false), [])
  const onCancel = useCallback(async () => {
    try {
      if (
        (await confirmPrompt({
          title: t('cancel_request_confirm'),
          body: t('cancel_request_choice'),
          deleteText: t('cancel_request'),
          cancelText: t('cancel_request_cancel'),
        })) !== true
      )
        return
      toast('notice', t('cancel_request_in_progress'), 2000)
      checkOut(undefined, {
        onSuccess: () => toast('info', t('cancel_request_success')),
        onError: () => toast('error', t('cancel_request_error')),
      })
    } catch (error) {
      captureException(error)
    }
  }, [checkOut, toast, t])
  const onCheckOut = useCallback(async () => {
    try {
      if (
        (await confirmPrompt({
          title: t('check_out_confirm'),
          body: t('check_out_choice'),
          deleteText: t('check_out'),
          cancelText: t('check_out_cancel'),
        })) !== true
      )
        return
      toast('notice', t('check_out_in_progress'), 2000)
      checkOut(undefined, {
        onSuccess: () => toast('info', t('check_out_success')),
        onError: () => toast('error', t('check_out_error')),
      })
    } catch (error) {
      captureException(error)
    }
  }, [checkOut, toast, t])

  useEffect(() => {
    if (data) {
      setAnnouncementMessage(a11y('registration_form_loaded', { status: data.State }))
    } else {
      setAnnouncementMessage(a11y('registration_form_new'))
    }
  }, [data, a11y])

  // Compose prefill data.
  const prefill = {
    // Prefilled from current registration, then local data, then reasonable default.
    displayName: data?.DisplayName ?? localData?.displayName ?? (claims?.name as string) ?? '',
    // Prefilled from current registration, then local data.
    websiteUrl: data?.WebsiteUrl ?? localData?.websiteUrl ?? '',
    shortDescription: data?.ShortDescription ?? localData?.shortDescription ?? '',
    telegramHandle: data?.TelegramHandle ?? localData?.telegramHandle ?? '',
    // Prefilled from current registration only.
    imageUri: data?.Image?.Url ?? '',
    // Never prefilled.
    location: '',
  }

  if (!isCheckedIn) return <Redirect href="/artists-alley" />

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <ScrollView
        style={StyleSheet.absoluteFill}
        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
        stickyHeaderIndices={[0]}
        accessibilityLabel={a11y('registration_form_scroll')}
        accessibilityHint={a11y('registration_form_scroll_hint')}
      >
        <Header>{t('title')}</Header>
        <Floater containerStyle={appStyles.trailer}>
          <View ref={mainContentRef} accessibilityLabel={a11y('registration_form_content')} accessibilityRole="text">
            {!data?.State ? null : (
              <Badge unpad={padFloater} badgeColor={stateToBackground[data.State as keyof typeof stateToBackground]} textColor="white">
                {tStatus(data.State)}
              </Badge>
            )}

            <Label type="para" className="my-5">
              {t('intro')}
            </Label>

            <Button
              icon="link"
              outline
              onPress={() => Linking.openURL(artistAlleyUrl)}
              accessibilityRole="button"
              accessibilityLabel={a11y('learn_more_button')}
              accessibilityHint={a11y('learn_more_button_hint')}
            >
              {t('learn_more')}
            </Button>

            {!isPending ? (
              show && data ? (
                <ArtistsAlleyStatus data={data} onEdit={onEdit} onCheckOut={onCheckOut} onCancel={onCancel} />
              ) : (
                <ArtistsAlleyEdit prefill={prefill} onDismiss={() => setShow(true)} mode={data ? 'change' : 'new'} />
              )
            ) : null}
          </View>
        </Floater>
      </ScrollView>
    </>
  )
}
