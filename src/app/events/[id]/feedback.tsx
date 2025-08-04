import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { router, useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { useCache } from '@/context/data/Cache'
import { z } from 'zod'
import { Label } from '@/components/generic/atoms/Label'
import { ManagedRating } from '@/components/generic/forms/ManagedRating'
import { ManagedTextInput } from '@/components/generic/forms/ManagedTextInput'
import { Button } from '@/components/generic/containers/Button'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthContext } from '@/context/auth/Auth'
import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { useEventFeedbackMutation } from '@/hooks/api/feedback/useEventFeedbackMutation'
import { useToastContext } from '@/context/ui/ToastContext'
import { useTheme } from '@/hooks/themes/useThemeHooks'

const feedbackSchema = z.object({
  rating: z
    .number()
    .min(1)
    .max(5)
    .transform((n) => Math.floor(n)),
  message: z.string().optional(),
  eventId: z.string(),
})

type FeedbackSchema = z.infer<typeof feedbackSchema>

export default function EventFeedback() {
  const { t } = useTranslation('EventFeedback')
  const { eventId } = useLocalSearchParams<{ eventId: string }>()
  const { toast } = useToastContext()
  const theme = useTheme()
  const { events } = useCache()
  const event = events.dict[eventId]

  const form = useForm<FeedbackSchema>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: undefined,
      message: undefined,
      eventId: eventId,
    },
  })

  const { mutate, isPending } = useEventFeedbackMutation()

  const { loggedIn } = useAuthContext()
  const { data: user } = useUserSelfQuery()
  const attending = Boolean(user?.RoleMap?.Attendee)

  const disabled = !loggedIn || !attending
  const disabledReason = (!loggedIn && t('disabled_not_logged_in')) || (!attending && t('disabled_not_attending'))

  const submit = useCallback(
    (args: FeedbackSchema) => {
      mutate(args, {
        onSuccess: () => {
          toast('info', 'Feedback submitted successfully')
          router.back()
        },
        onError: () => toast('error', 'Failed to submit feedback'),
      })
    },
    [mutate, toast]
  )

  return (
    <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]}>
      <Header>{t('header', { eventTitle: event?.Title, interpolation: { escapeValue: false } })}</Header>
      <Floater>
        <FormProvider {...form}>
          <Label variant="narrow">
            {t('explanation', {
              eventTitle: event?.Title,
              interpolation: { escapeValue: false },
            })}
          </Label>

          <ManagedRating<FeedbackSchema> name="rating" label={t('rating_title')} minRating={1} enableHalfStar={false} color={theme.secondary} style={styles.star} starSize={52} />

          <ManagedTextInput<FeedbackSchema> name="message" label={t('message_title')} placeholder={t('message_placeholder')} numberOfLines={8} multiline />

          <Button onPress={form.handleSubmit(submit)} disabled={isPending || disabled}>
            {t('submit')}
          </Button>

          {disabledReason && (
            <Label type="caption" color="important" variant="middle" className="mt-4">
              {disabledReason}
            </Label>
          )}

          {isPending && <Label className="mt-4">{t('submit_in_progress')}</Label>}
        </FormProvider>
      </Floater>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  star: {
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
})
