import { zodResolver } from '@hookform/resolvers/zod'
import { captureException } from '@sentry/react-native'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, View } from 'react-native'
import { z } from 'zod'

import { Section } from '@/components/generic/atoms/Section'
import { Button } from '@/components/generic/containers/Button'
import { ManagedTextInput } from '@/components/generic/forms/ManagedTextInput'
import { addEnterpriseNetwork } from '@/components/wifi/efWifiModule'
import {
  buildOnsiteFileUrl,
  buildOnsiteProfileUrl,
  credentialsForProfile,
  WIFI_ANONYMOUS_IDENTITY,
  WIFI_DOMAIN_SUFFIX_MATCH,
  WIFI_SSID,
  type WifiProfileId,
} from '@/components/wifi/wifi.common'
import { useToastContext } from '@/context/ui/ToastContext'
import { useAuthState } from '@/data/clients/auth'
import { inRole } from '@/data/clients/auth.utils'
import { confirmPrompt } from '@/util/confirmPrompt'

const customSchema = z.object({
  identity: z.string().min(1).max(128).trim(),
  password: z.string().min(1).max(128),
})
type CustomSchema = z.infer<typeof customSchema>

export type WifiSetupProps = {
  initialProfile?: WifiProfileId
  initialIdentity?: string
  initialPassword?: string
}

export function WifiSetup({
  initialProfile,
  initialIdentity,
  initialPassword,
}: WifiSetupProps) {
  const { t } = useTranslation('WiFi')
  const { toast } = useToastContext()
  const [profile, _setProfile] = useState<WifiProfileId>(
    initialProfile ?? 'custom'
  )
  const [busy, setBusy] = useState(false)

  const { user } = useAuthState()
  const isStaff = inRole(user, 'Staff')

  const form = useForm<CustomSchema>({
    resolver: zodResolver(customSchema),
    mode: 'onChange',
    defaultValues: {
      identity: initialIdentity ?? '',
      password: initialPassword ?? '',
    },
  })

  const apply = useCallback(async () => {
    try {
      const values = profile === 'custom' ? form.getValues() : undefined
      const custom = values
        ? { identity: values.identity.trim(), password: values.password }
        : undefined
      if (profile === 'custom' && !(await form.trigger())) {
        toast('error', t('invalid_credentials'), 3000)
        return
      }
      const creds = credentialsForProfile(profile, custom)
      if (!creds) {
        toast('error', t('invalid_credentials'), 3000)
        return
      }

      const confirmed = await confirmPrompt({
        title: t('confirm_title'),
        body: t('confirm_body', { profile: t(`profile_${profile}_name`) }),
        confirmText: t('confirm_apply'),
        cancelText: t('confirm_cancel'),
      })
      if (confirmed !== true) return

      setBusy(true)
      if (Platform.OS === 'android') {
        await addEnterpriseNetwork(
          WIFI_SSID,
          creds.identity,
          creds.password,
          WIFI_ANONYMOUS_IDENTITY,
          WIFI_DOMAIN_SUFFIX_MATCH
        )
        toast('info', t('apply_success'), 4000)
      } else {
        // iOS: public profiles open a pre-filled static .mobileconfig directly (one-tap install);
        // custom creds can't be static, so they open the prefilled onsite page (tap Download there).
        const url =
          profile === 'custom'
            ? buildOnsiteProfileUrl(creds.identity, creds.password)
            : buildOnsiteFileUrl(profile)
        await Linking.openURL(url)
      }
    } catch (error) {
      captureException(error)
      toast('error', t('apply_failed'), 4000)
    } finally {
      setBusy(false)
    }
  }, [profile, form, toast, t])

  return (
    <View>
      {isStaff ? (
        <>
          <Section
            icon='wifi'
            title={t('title_staff')}
            subtitle={t('subtitle_staff')}
          />

          <Button
            icon='qrcode-scan'
            outline
            className='mb-4'
            onPress={() => router.navigate('/wifi/scan')}
          >
            {t('scan_qr')}
          </Button>

          <FormProvider {...form}>
            <ManagedTextInput<CustomSchema>
              name='identity'
              label={t('identity_label')}
              placeholder={t('identity_placeholder')}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <ManagedTextInput<CustomSchema>
              name='password'
              label={t('password_label')}
              placeholder={t('password_placeholder')}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry
            />
          </FormProvider>

          <Button icon='wifi' className='mt-4' disabled={busy} onPress={apply}>
            {t('apply')}
          </Button>
        </>
      ) : (
        <Section
          icon='wifi'
          title={t('title_public')}
          subtitle={t('subtitle_public')}
        />
      )}
    </View>
  )
}
