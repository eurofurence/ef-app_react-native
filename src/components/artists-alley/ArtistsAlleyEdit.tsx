import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { useToastContext } from '@/context/ui/ToastContext'
import { ManagedTextInput } from '@/components/generic/forms/ManagedTextInput'
import { ManagedImagePicker } from '@/components/generic/forms/ManagedImagePicker'
import { Button } from '@/components/generic/containers/Button'
import { Label } from '@/components/generic/atoms/Label'
import { useArtistsAlleyTableRegistrationRequestMutation } from '@/hooks/api/artists-alley/useArtistsAlleyTableRegistrationRequestMutation'
import { captureException } from '@sentry/react-native'

const websiteUrlMatcher = /^\s*((http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)\s*)?$/
const telegramHandleMatcher = /^\s*(@?[a-zA-Z0-9_]{5,64}\s*)?$/
const tableNumberMatcher = /^\s*[0-9]+\s*$/

const artistsAlleySchema = z.object({
  displayName: z.string().min(1).trim(),
  websiteUrl: z
    .string()
    .regex(websiteUrlMatcher)
    .transform((value) => {
      if (value.trim().length === 0) return ''
      if (value.startsWith('http://') || value.startsWith('https://')) return value.trim()
      return `https://${value}`.trim()
    }),
  shortDescription: z.string().min(1).trim(),
  location: z.string().min(1).regex(tableNumberMatcher).trim(),
  telegramHandle: z.string().regex(telegramHandleMatcher).trim(),
  imageUri: z.string().min(1).url().trim(),
})

type ArtistsAlleySchema = z.infer<typeof artistsAlleySchema>

export type ArtistsAlleyEditProps = {
  prefill: ArtistsAlleySchema
  mode: 'change' | 'new'
  onDismiss: () => void
}

// TODO: This is actually "table registration edit" but naming in this land is a nightmare :')
export const ArtistsAlleyEdit = ({ prefill, mode, onDismiss }: ArtistsAlleyEditProps) => {
  // Get current registration. Create submit mutation.
  const { mutateAsync: submitRegistration, isPending } = useArtistsAlleyTableRegistrationRequestMutation()

  // Use toast function.
  const { toast } = useToastContext()

  // Get translation functions.
  const { t } = useTranslation('ArtistsAlley')
  const { t: tErrors } = useTranslation('ArtistsAlley', { keyPrefix: 'errors' })

  // Make an error translator. This accounts for named errors.
  const errorTranslator = useCallback(
    (name: string, type: string) =>
      tErrors(`${name}_${type}`, {
        defaultValue: tErrors(type),
      }),
    [tErrors]
  )

  // Compute disabled and disabled status text.
  const disabled = isPending

  // Make a form with the given scheme and sensible defaults.
  const form = useForm<ArtistsAlleySchema>({
    resolver: zodResolver(artistsAlleySchema),
    disabled,
    mode: 'onChange',
    defaultValues: prefill,
  })

  // Submit the data. On success, notify and dismiss the form, otherwise mark error.
  const doSubmit = useCallback(
    (data: ArtistsAlleySchema) => {
      toast('notice', t('submit_in_progress'))
      submitRegistration(data).then(
        () => {
          toast('info', t('submit_succeeded'), 6000)
          onDismiss()
        },
        (error) => {
          toast('error', t('submit_failed'), 6000)
          captureException(error)
        }
      )
    },
    [submitRegistration, toast, t, onDismiss]
  )

  return (
    <FormProvider {...form}>
      <Label type="compact" mt={20} mb={40}>
        {t(mode === 'change' ? 'explanation_edit_change' : 'explanation_edit_new')}
      </Label>

      <ManagedTextInput<ArtistsAlleySchema> name="displayName" label={t('display_name_label')} errorTranslator={errorTranslator} placeholder={t('display_name_placeholder')} />
      <ManagedTextInput<ArtistsAlleySchema>
        name="websiteUrl"
        label={t('website_url_label')}
        errorTranslator={errorTranslator}
        placeholder={t('website_url_placeholder')}
        inputMode="url"
        keyboardType="url"
      />
      <ManagedTextInput<ArtistsAlleySchema>
        name="shortDescription"
        label={t('short_description_label')}
        errorTranslator={errorTranslator}
        placeholder={t('short_description_placeholder')}
        multiline
        numberOfLines={8}
      />
      <ManagedTextInput<ArtistsAlleySchema>
        name="location"
        label={t('location_label')}
        errorTranslator={errorTranslator}
        placeholder={t('location_placeholder')}
        inputMode="numeric"
        keyboardType="numeric"
      />
      <ManagedTextInput<ArtistsAlleySchema>
        name="telegramHandle"
        label={t('telegram_handle_label')}
        errorTranslator={errorTranslator}
        placeholder={t('telegram_handle_placeholder')}
      />

      <ManagedImagePicker<ArtistsAlleySchema>
        name="imageUri"
        label={t('submission_image_label')}
        errorTranslator={errorTranslator}
        placeholder={t('submission_image_placeholder')}
      />

      <Button style={styles.button} onPress={form.handleSubmit(doSubmit)} disabled={disabled}>
        {t(mode === 'change' ? 'update' : 'submit')}
      </Button>

      {mode === 'new' ? null : (
        <Button style={styles.button} onPress={onDismiss} outline>
          {t('dismiss')}
        </Button>
      )}
    </FormProvider>
  )
}

const styles = StyleSheet.create({
  locked: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 16,
  },
  star: {
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  button: {
    marginTop: 20,
  },
})
