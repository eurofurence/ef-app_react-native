import { zodResolver } from '@hookform/resolvers/zod'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { z } from 'zod'

import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Button } from '@/components/generic/containers/Button'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { ManagedRating } from '@/components/generic/forms/ManagedRating'
import { ManagedTextInput } from '@/components/generic/forms/ManagedTextInput'
import { useAuthContext } from '@/context/auth/Auth'
import { useUserContext } from '@/context/auth/User'
import { useCache } from '@/context/data/Cache'
import { useToastContext } from '@/context/ui/ToastContext'
import { useEventFeedbackMutation } from '@/hooks/api/feedback/useEventFeedbackMutation'
import { useTheme } from '@/hooks/themes/useThemeHooks'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'

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
  const { id: eventId } = useLocalSearchParams<{ id: string }>()
  const { toast } = useToastContext()
  const theme = useTheme()
  const { events } = useCache()
  const event = events.dict[eventId]
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

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
  const { user } = useUserContext()
  const attending = Boolean(user?.RoleMap?.Attendee)

  const disabled = !loggedIn || !attending
  const disabledReason = (!loggedIn && t('disabled_not_logged_in')) || (!attending && t('disabled_not_attending'))

  // Announce the feedback form to screen readers
  useEffect(() => {
    if (event) {
      const message = t('accessibility.feedback_form_loaded', { title: event.Title })
      setAnnouncementMessage(message)
    }
  }, [event, t])

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
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage message={announcementMessage} type="assertive" visible={false} />

      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        accessibilityLabel={t('accessibility.feedback_form_scroll')}
        accessibilityHint={t('accessibility.feedback_form_scroll_hint')}
      >
        <Header>{t('header', { eventTitle: event?.Title, interpolation: { escapeValue: false } })}</Header>
        <Floater>
          <View ref={mainContentRef} accessibilityLabel={t('accessibility.feedback_form_content')} accessibilityRole="text">
            <FormProvider {...form}>
              <Label variant="narrow">
                {t('explanation', {
                  eventTitle: event?.Title,
                  interpolation: { escapeValue: false },
                })}
              </Label>

              <ManagedRating<FeedbackSchema>
                name="rating"
                label={t('rating_title')}
                minRating={1}
                enableHalfStar={false}
                color={theme.secondary}
                style={styles.star}
                starSize={52}
              />

              <ManagedTextInput<FeedbackSchema> name="message" label={t('message_title')} placeholder={t('message_placeholder')} numberOfLines={8} multiline />

              <Button
                onPress={form.handleSubmit(submit)}
                disabled={isPending || disabled}
                accessibilityLabel={t('accessibility.submit_feedback')}
                accessibilityHint={t('accessibility.submit_feedback_hint')}
                accessibilityRole="button"
              >
                {t('submit')}
              </Button>

              {disabledReason && (
                <Label type="caption" color="important" variant="middle" className="mt-4">
                  {disabledReason}
                </Label>
              )}

              {isPending && <Label className="mt-4">{t('submit_in_progress')}</Label>}
            </FormProvider>
          </View>
        </Floater>
      </ScrollView>
    </>
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
