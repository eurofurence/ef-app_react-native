import { Header } from '@/components/generic/containers/Header'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { appStyles } from '@/components/AppStyles'
import { Badge } from '@/components/generic/containers/Badge'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { Linking, StyleSheet, RefreshControl, ScrollView } from 'react-native'
import { ArtistsAlleyEdit } from '@/components/artists-alley/ArtistsAlleyEdit'
import { ArtistsAlleyStatus } from '@/components/artists-alley/ArtistsAlleyStatus'
import { ArtistsAlleyUnauthorized } from '@/components/artists-alley/ArtistsAlleyUnauthorized'
import { artistAlleyUrl } from '@/configuration'
import { useArtistsAlleyOwnRegistrationQuery } from '@/hooks/api/artists-alley/useArtistsAlleyOwnRegistrationQuery'
import { useArtistsAlleyCheckOutMutation } from '@/hooks/api/artists-alley/useArtistsAlleyCheckOutMutation'
import { useToastContext } from '@/context/ui/ToastContext'
import { useArtistsAlleyLocalData } from '@/components/artists-alley/ArtistsAlley.common'
import { useUserContext } from '@/context/auth/User'

const stateToBackground = {
  Pending: 'warning',
  Accepted: 'primary',
  Published: 'primary',
  Rejected: 'notification',
} as const

export default function Register() {
  const { t } = useTranslation('ArtistsAlley')
  const { t: tStatus } = useTranslation('ArtistsAlley', { keyPrefix: 'status' })

  // Get user data for RBAC checks and pre-filling.
  const { claims, user } = useUserContext()

  // Get roles for preemptive RBAC.
  const attending = Boolean(user?.RoleMap?.Attendee)
  const checkedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)
  const authorized = user && attending && checkedIn

  // Get current registration if available. Only run when authorized.
  const { data, isPending, refetch } = useArtistsAlleyOwnRegistrationQuery()
  const { mutate: checkOut } = useArtistsAlleyCheckOutMutation()
  const { localData } = useArtistsAlleyLocalData()
  const { toast } = useToastContext()

  // Switch for show and edit modes.
  const [show, setShow] = useState(true)

  const onEdit = useCallback(() => setShow(false), [])
  const onCancel = useCallback(() => {
    checkOut(undefined, {
      onSuccess: () => toast('info', t('cancel_request_success')),
      onError: () => toast('error', t('cancel_request_error')),
    })
  }, [checkOut, toast, t])
  const onCheckOut = useCallback(() => {
    checkOut(undefined, {
      onSuccess: () => toast('info', t('check_out_success')),
      onError: () => toast('error', t('check_out_error')),
    })
  }, [checkOut, toast, t])

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

  return (
    <ScrollView style={StyleSheet.absoluteFill} refreshControl={authorized ? <RefreshControl refreshing={isPending} onRefresh={refetch} /> : undefined} stickyHeaderIndices={[0]}>
      <Header>{t('title')}</Header>
      <Floater containerStyle={appStyles.trailer}>
        {!data?.State ? null : (
          <Badge unpad={padFloater} badgeColor={stateToBackground[data.State as keyof typeof stateToBackground]} textColor="white">
            {tStatus(data.State)}
          </Badge>
        )}
        <Label type="compact" className="mt-5">
          {t('intro')}
        </Label>
        <Button style={styles.button} icon="link" onPress={() => Linking.openURL(artistAlleyUrl)}>
          {t('learn_more')}
        </Button>
        {authorized ? (
          !isPending ? (
            show && data ? (
              <ArtistsAlleyStatus data={data} onEdit={onEdit} onCheckOut={onCheckOut} onCancel={onCancel} />
            ) : (
              <ArtistsAlleyEdit prefill={prefill} onDismiss={() => setShow(true)} mode={data ? 'change' : 'new'} />
            )
          ) : null
        ) : (
          <ArtistsAlleyUnauthorized loggedIn={Boolean(user)} attending={attending} checkedIn={checkedIn} />
        )}
      </Floater>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
})
