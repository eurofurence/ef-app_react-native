import { Header } from '@/components/generic/containers/Header'
import { useAuthContext } from '@/context/auth/Auth'
import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { appStyles } from '@/components/AppStyles'
import { Badge } from '@/components/generic/containers/Badge'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { Linking, StyleSheet } from 'react-native'
import { ArtistsAlleyEdit } from '@/components/artists-alley/ArtistsAlleyEdit'
import { ArtistsAlleyStatus } from '@/components/artists-alley/ArtistsAlleyStatus'
import { ArtistsAlleyUnauthorized } from '@/components/artists-alley/ArtistsAlleyUnauthorized'
import { artistAlleyUrl } from '@/configuration'
import { useArtistsAlleyOwnRegistrationQuery } from '@/hooks/api/artists-alley/useArtistsAlleyOwnRegistrationQuery'
import { useArtistsAlleyCheckOutMutation } from '@/hooks/api/artists-alley/useArtistsAlleyCheckOutMutation'
import { useToastContext } from '@/context/ui/ToastContext'

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
  const { loggedIn, claims } = useAuthContext()
  const { data: user } = useUserSelfQuery()

  // Get roles for preemptive RBAC.
  const attending = Boolean(user?.RoleMap?.Attendee)
  const checkedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)
  const authorized = loggedIn && attending && checkedIn

  // Get current registration if available. Only run when authorized.
  const { data, isPending, refetch } = useArtistsAlleyOwnRegistrationQuery()
  const { mutate: checkOut } = useArtistsAlleyCheckOutMutation()
  const { toast } = useToastContext()

  // Switch for show and edit modes.
  const [show, setShow] = useState(true)

  const onEdit = useCallback(() => setShow(false), [])
  const onCheckOut = useCallback(() => {
    checkOut(undefined, {
      onSuccess: () => toast('info', 'Checked out'),
      onError: () => toast('error', 'Failed to check out'),
    })
  }, [checkOut, toast])

  return (
    <ScrollView style={StyleSheet.absoluteFill} refreshControl={authorized ? <RefreshControl refreshing={isPending} onRefresh={refetch} /> : undefined} stickyHeaderIndices={[0]}>
      <Header>{t('title')}</Header>
      <Floater containerStyle={appStyles.trailer}>
        {!data?.State ? null : (
          <Badge unpad={padFloater} badgeColor={stateToBackground[data.State as keyof typeof stateToBackground]} textColor="white">
            {tStatus(data.State)}
          </Badge>
        )}
        <Label type="compact" mt={20}>
          {t('intro')}
        </Label>
        <Button style={styles.button} icon="link" onPress={() => Linking.openURL(artistAlleyUrl)}>
          {t('learn_more')}
        </Button>
        {authorized ? (
          !isPending ? (
            show && data ? (
              <ArtistsAlleyStatus data={data} onEdit={onEdit} onCheckOut={onCheckOut} />
            ) : (
              <ArtistsAlleyEdit
                prefill={{
                  displayName: data?.DisplayName ?? (claims?.name as string) ?? '',
                  websiteUrl: data?.WebsiteUrl ?? '',
                  shortDescription: data?.ShortDescription ?? '',
                  telegramHandle: data?.TelegramHandle ?? '',
                  imageUri: data?.Image?.Url ?? '',
                  location: '',
                }}
                onDismiss={() => setShow(true)}
                mode={data ? 'change' : 'new'}
              />
            )
          ) : null
        ) : (
          <ArtistsAlleyUnauthorized loggedIn={loggedIn} attending={attending} checkedIn={checkedIn} />
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
