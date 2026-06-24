import { zodResolver } from '@hookform/resolvers/zod'
import { captureException } from '@sentry/react-native'
import { router } from 'expo-router'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, View } from 'react-native'
import { z } from 'zod'

import { Label } from '@/components/generic/atoms/Label'
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
  WIFI_PROFILE_IDS,
  WIFI_SSID,
  type WifiProfileId,
} from '@/components/wifi/wifi.common'
import { useToastContext } from '@/context/ui/ToastContext'
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
  const [profile, setProfile] = useState<WifiProfileId>(
    initialProfile ?? 'eurofurence'
  )
  const [busy, setBusy] = useState(false)

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
      const custom = profile === 'custom' ? form.getValues() : undefined
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
        addEnterpriseNetwork(
          ssid: WIFI_SSID,
          identity: creds.identity,
          password: creds.password,
          anonymous_identity: WIFI_ANONYMOUS_IDENTITY,
          suffix_match: WIFI_DOMAIN_SUFFIX_MATCH,
        )
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
      <Section icon='wifi' title={t('title')} subtitle={t('subtitle')} />
	  
      <Button
        icon='qrcode-scan'
        outline
        className='mt-2'
        onPress={() => router.navigate('/wifi/scan')}
      >
        {t('scan_qr')}
      </Button>

      <Button icon='wifi' className='mt-4' disabled={busy} onPress={apply}>
        {t('apply')}
      </Button>
	  
	  <Section icon='cog' title={t('advanced_title')} subtitle={t('intro')}/>

      {WIFI_PROFILE_IDS.map((id) => (
        <Button
          key={id}
          icon={profile === id ? 'radiobox-marked' : 'radiobox-blank'}
          outline={profile !== id}
          className='mb-2'
          onPress={() => setProfile(id)}
          accessibilityRole='radio'
          accessibilityLabel={t(`profile_${id}_name`)}
          accessibilityHint={t(`profile_${id}_desc`)}
        >
		{profile === id ? (
          t(`profile_${id}_name`) + "\n\n" +  t(`profile_${id}_desc`)
		  ) : (
		  t(`profile_${id}_name`)
		)}
        </Button>
      ))}

      {profile === 'custom' ? (
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
      ) : null}
    </View>
  )
}
