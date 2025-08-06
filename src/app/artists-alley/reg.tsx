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
import { artistAlleyUrl } from '@/configuration'
import { useArtistsAlleyOwnRegistrationQuery } from '@/hooks/api/artists-alley/useArtistsAlleyOwnRegistrationQuery'
import { useArtistsAlleyCheckOutMutation } from '@/hooks/api/artists-alley/useArtistsAlleyCheckOutMutation'
import { useToastContext } from '@/context/ui/ToastContext'
import { useArtistsAlleyLocalData } from '@/components/artists-alley/ArtistsAlley.common'
import { useUserContext } from '@/context/auth/User'
import { Redirect } from 'expo-router'

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
  const isCheckedIn = Boolean(user?.RoleMap?.AttendeeCheckedIn)

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

  if (!isCheckedIn) return <Redirect href="/artists-alley" />

  return (
    <ScrollView style={StyleSheet.absoluteFill} refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />} stickyHeaderIndices={[0]}>
      <Header>{t('title')}</Header>
      <Floater containerStyle={appStyles.trailer}>
        {!data?.State ? null : (
          <Badge unpad={padFloater} badgeColor={stateToBackground[data.State as keyof typeof stateToBackground]} textColor="white">
            {tStatus(data.State)}
          </Badge>
        )}

        <Label type="para" className="my-5">
          {t('intro')}
        </Label>

        <Button icon="link" outline onPress={() => Linking.openURL(artistAlleyUrl)}>
          {t('learn_more')}
        </Button>

        {!isPending ? (
          show && data ? (
            <ArtistsAlleyStatus data={data} onEdit={onEdit} onCheckOut={onCheckOut} onCancel={onCancel} />
          ) : (
            <ArtistsAlleyEdit prefill={prefill} onDismiss={() => setShow(true)} mode={data ? 'change' : 'new'} />
          )
        ) : null}
      </Floater>
    </ScrollView>
  )
}
