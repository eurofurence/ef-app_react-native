import { Header } from '@/components/generic/containers/Header'
import { useAuthContext } from '@/context/auth/Auth'
import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { appStyles } from '@/components/AppStyles'
import { Badge } from '@/components/generic/containers/Badge'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { Linking, StyleSheet } from 'react-native'
import { ArtistAlleyEdit } from '@/components/artist-alley/ArtistAlleyEdit'
import { ArtistAlleyStatus } from '@/components/artist-alley/ArtistAlleyStatus'
import { ArtistAlleyUnauthorized } from '@/components/artist-alley/ArtistAlleyUnauthorized'
import { artistAlleyUrl } from '@/configuration'
import { useArtistAlleyOwnRegistrationQuery } from '@/hooks/api/artist-alley/useArtistAlleyOwnRegistrationQuery'

const stateToBackground = {
  Pending: 'warning',
  Accepted: 'primary',
  Published: 'primary',
  Rejected: 'notification',
} as const

export default function ArtistAlleyRegistration() {
  const { t } = useTranslation('ArtistAlley')
  const { t: tStatus } = useTranslation('ArtistAlley', { keyPrefix: 'status' })

  // Get user data for RBAC checks and pre-filling.
  const { loggedIn, claims } = useAuthContext()
  const { data: user } = useUserSelfQuery()

  // Get roles for preemptive RBAC.
  const attending = Boolean(user?.Roles?.includes('Attendee'))
  const checkedIn = Boolean(user?.Roles?.includes('AttendeeCheckedIn'))
  const authorized = loggedIn && attending && checkedIn

  // Get current registration if available. Only run when authorized.
  const { data, isPending, refetch } = useArtistAlleyOwnRegistrationQuery()

  // Switch for show and edit modes.
  const [show, setShow] = useState(true)

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
              <ArtistAlleyStatus data={data} onEdit={() => setShow(false)} />
            ) : (
              <ArtistAlleyEdit
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
          <ArtistAlleyUnauthorized loggedIn={loggedIn} attending={attending} checkedIn={checkedIn} />
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
