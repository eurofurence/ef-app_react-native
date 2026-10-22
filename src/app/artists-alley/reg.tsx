import { captureException } from '@sentry/react-native'
import { useLiveQuery } from '@tanstack/react-db'
import { Redirect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native'
import { appStyles } from '@/components/AppStyles'
import { useArtistsAlleyLocalData } from '@/components/artists-alley/ArtistsAlley.common'
import { ArtistsAlleyEdit } from '@/components/artists-alley/ArtistsAlleyEdit'
import { ArtistsAlleyStatus } from '@/components/artists-alley/ArtistsAlleyStatus'
import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Badge } from '@/components/generic/containers/Badge'
import { Button } from '@/components/generic/containers/Button'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { artistAlleyUrl } from '@/configuration'
import { useToastContext } from '@/context/ToastContext'
import { useAuthState } from '@/data/clients/auth'
import { inRole } from '@/data/clients/auth.utils'
import {
  artistsAlleyOwnCheckout,
  artistsAlleyOwnCollection,
} from '@/data/collections/artists-alley/ArtistsAlleyOwn'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { confirmPrompt } from '@/util/confirmPrompt'
import { vibrateAfter } from '@/util/vibrateAfter'

const stateToBackground = {
  Pending: 'warning',
  Accepted: 'primary',
  Published: 'primary',
  Rejected: 'notification',
} as const

export default function Register() {
  const { t } = useTranslation('ArtistsAlley')
  const { t: tStatus } = useTranslation('ArtistsAlley', { keyPrefix: 'status' })
  const { t: a11y } = useTranslation('ArtistsAlley', {
    keyPrefix: 'accessibility',
  })

  // Get user data for RBAC checks and pre-filling.
  const { claims, user } = useAuthState()

  // Get roles for preemptive RBAC.
  const isCheckedIn = inRole(user, 'AttendeeCheckedIn')

  // Get current registration if available. Only run when authorized.
  const {
    data: [own],
    isLoading,
  } = useLiveQuery(artistsAlleyOwnCollection)
  const [localData] = useArtistsAlleyLocalData()
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
      await artistsAlleyOwnCheckout().then(
        () => toast('info', t('cancel_request_success')),
        () => toast('error', t('cancel_request_error'))
      )
    } catch (error) {
      captureException(error)
    }
  }, [toast, t])

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
      await artistsAlleyOwnCheckout().then(
        () => toast('info', t('check_out_success')),
        () => toast('error', t('check_out_error'))
      )
    } catch (error) {
      captureException(error)
    }
  }, [toast, t])

  useEffect(() => {
    if (own) {
      setAnnouncementMessage(
        a11y('registration_form_loaded', { status: own.State })
      )
    } else {
      setAnnouncementMessage(a11y('registration_form_new'))
    }
  }, [own, a11y])

  // Compose prefill data.
  const prefill = {
    // Prefilled from current registration, then local data, then reasonable default.
    displayName:
      own?.DisplayName ??
      localData?.DisplayName ??
      (claims?.name as string) ??
      '',
    // Prefilled from current registration, then local data.
    websiteUrl: own?.WebsiteUrl ?? localData?.WebsiteUrl ?? '',
    shortDescription:
      own?.ShortDescription ?? localData?.ShortDescription ?? '',
    telegramHandle: own?.TelegramHandle ?? localData?.TelegramHandle ?? '',
    // Prefilled from current registration only.
    imageUri: own?.Image?.Url ?? '',
    // Never prefilled.
    location: '',
  }

  if (!isCheckedIn) return <Redirect href='/artists-alley' />

  return (
    <>
      <StatusMessage message={announcementMessage} />
      <ScrollView
        style={StyleSheet.absoluteFill}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() =>
              vibrateAfter(artistsAlleyOwnCollection.utils.refetch())
            }
          />
        }
        stickyHeaderIndices={[0]}
        accessibilityLabel={a11y('registration_form_scroll')}
        accessibilityHint={a11y('registration_form_scroll_hint')}
      >
        <Header>{t('title')}</Header>
        <Floater containerStyle={appStyles.trailer}>
          <View
            ref={mainContentRef}
            accessibilityLabel={a11y('registration_form_content')}
            accessibilityRole='text'
          >
            {!own?.State ? null : (
              <Badge
                unpad={padFloater}
                badgeColor={
                  stateToBackground[own.State as keyof typeof stateToBackground]
                }
                textColor='white'
              >
                {tStatus(own.State)}
              </Badge>
            )}

            <Label type='para' className='my-5'>
              {t('intro')}
            </Label>

            <Button
              icon='link'
              outline
              onPress={() => Linking.openURL(artistAlleyUrl)}
              accessibilityRole='button'
              accessibilityLabel={a11y('learn_more_button')}
              accessibilityHint={a11y('learn_more_button_hint')}
            >
              {t('learn_more')}
            </Button>

            {!isLoading ? (
              show && own ? (
                <ArtistsAlleyStatus
                  data={own}
                  onEdit={onEdit}
                  onCheckOut={onCheckOut}
                  onCancel={onCancel}
                />
              ) : (
                <ArtistsAlleyEdit
                  prefill={prefill}
                  onDismiss={() => setShow(true)}
                  mode={own ? 'change' : 'new'}
                />
              )
            ) : null}
          </View>
        </Floater>
      </ScrollView>
    </>
  )
}
