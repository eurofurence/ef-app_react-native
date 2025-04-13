import { zodResolver } from '@hookform/resolvers/zod'
import { router, useLocalSearchParams } from 'expo-router'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import { feedbackSchema, FeedbackSchema } from './FeedbackForm.schema'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { ManagedRating } from '@/components/generic/forms/ManagedRating'
import { ManagedTextInput } from '@/components/generic/forms/ManagedTextInput'
import { useAuthContext } from '@/context/AuthContext'
import { useTheme } from '@/hooks/themes/useThemeHooks'
import { useSubmitEventFeedback } from '@/services/events'
import { useCache } from '@/context/data/Cache'

export const FeedbackForm = () => {
  const theme = useTheme()
  const { id } = useLocalSearchParams<{ id: string }>()
  const { events } = useCache()

  const { execute: submitFeedback, isLoading: isSubmitting } = useSubmitEventFeedback()
  const { t } = useTranslation('EventFeedback')
  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: undefined,
      message: undefined,
      eventId: id,
    },
  })

  const { loggedIn, user } = useAuthContext()
  const attending = Boolean(user?.Roles?.includes('Attendee'))

  const disabled = !loggedIn || !attending
  const disabledReason = (!loggedIn && t('disabled_not_logged_in')) || (!attending && t('disabled_not_attending'))

  const event = events.dict[id]

  const submit = useCallback(
    async (data: FeedbackSchema) => {
      try {
        await submitFeedback({
          ...data,
          eventId: event!.Id,
        })
        router.back()
      } catch (error) {
        console.error('Failed to submit feedback:', error)
      }
    },
    [event, submitFeedback]
  )

  return (
    <FormProvider {...form}>
      <Label variant="narrow">{t('explanation', { eventTitle: event?.Title, interpolation: { escapeValue: false } })}</Label>

      <ManagedRating<FeedbackSchema> name="rating" label={t('rating_title')} minRating={1} enableHalfStar={false} color={theme.secondary} style={styles.star} starSize={52} />

      <ManagedTextInput<FeedbackSchema> name="message" label={t('message_title')} placeholder={t('message_placeholder')} numberOfLines={8} multiline />

      <Button onPress={form.handleSubmit(submit)} disabled={isSubmitting || disabled}>
        {t('submit')}
      </Button>

      {disabledReason && (
        <Label type="caption" color="important" variant="middle" mt={16}>
          {disabledReason}
        </Label>
      )}

      {isSubmitting && <Label mt={16}>{t('submit_in_progress')}</Label>}
    </FormProvider>
  )
}

const styles = StyleSheet.create({
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
  error: {
    fontSize: 10,
    color: '#a01010',
  },
})
