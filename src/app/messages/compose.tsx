import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { Button } from '@/components/generic/containers/Button'
import { Floater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { ManagedChoiceButtons } from '@/components/generic/forms/ManagedChoiceButtons'
import { ManagedTextInput } from '@/components/generic/forms/ManagedTextInput'
import { useUserContext } from '@/context/auth/User'
import { useToastContext } from '@/context/ui/ToastContext'
import { useCommunicationsSendMutation } from '@/hooks/api/communications/useCommunicationsSendMutation'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { zodResolver } from '@hookform/resolvers/zod'
import { Redirect } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet, View } from 'react-native'
import { z } from 'zod'

const messageSchema = z.object({
  type: z.literal('byRegistrationId').or(z.literal('byIdentityId')),
  recipientUid: z.string(),
  authorName: z.string(),
  toastTitle: z.string(),
  toastMessage: z.string(),
  subject: z.string(),
  message: z.string(),
})

type MessageSchema = z.infer<typeof messageSchema>

const typeChoices = ['byRegistrationId', 'byIdentityId']

function typeChoiceLabel(choice: string) {
  return choice === 'byRegistrationId' ? 'Registration ID' : 'Identity ID'
}

export default function ComposeMessage() {
  const { user } = useUserContext()
  const { t } = useTranslation('PrivateMessageCompose')
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

  const isAdmin = Boolean(user?.RoleMap?.Admin)
  const isPrivateMessageSender = Boolean(user?.RoleMap?.PrivateMessageSender)

  const form = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      type: 'byRegistrationId',
    },
  })

  const { mutate, isPending } = useCommunicationsSendMutation()
  const { toast } = useToastContext()

  // Announce form loaded to screen readers
  useEffect(() => {
    setAnnouncementMessage(t('accessibility.compose_form_loaded'))
  }, [t])

  const onSend = useCallback(
    (args: MessageSchema) => {
      mutate(args, {
        onSuccess: () => toast('info', 'Message sent'),
        onError: () => toast('error', 'Failed to send message'),
      })
    },
    [mutate, toast]
  )
  if (!isAdmin && !isPrivateMessageSender) return <Redirect href="/messages" />

  return (
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage message={announcementMessage} type="polite" visible={false} />

      <ScrollView
        style={StyleSheet.absoluteFill}
        stickyHeaderIndices={[0]}
        accessibilityLabel={t('accessibility.compose_form_scroll')}
        accessibilityHint={t('accessibility.compose_form_scroll_hint')}
      >
        <Header>Compose message</Header>
        <Floater>
          <View ref={mainContentRef} accessibilityLabel={t('accessibility.compose_form_content')} accessibilityRole="text" style={{ marginVertical: 30, gap: 20 }}>
            <FormProvider {...form}>
              <ManagedChoiceButtons<MessageSchema> name="type" label="Send by" choices={typeChoices} getLabel={typeChoiceLabel} />
              <ManagedTextInput<MessageSchema> name="recipientUid" label="Recipient" placeholder="Recipient's ID" />
              <ManagedTextInput<MessageSchema> name="authorName" label="Author name" placeholder="John Doe" />
              <ManagedTextInput<MessageSchema> name="toastTitle" label="Toast title" placeholder="Shown in toast" />
              <ManagedTextInput<MessageSchema> name="toastMessage" label="Toast message" placeholder="Shown as toast content" />
              <ManagedTextInput<MessageSchema> name="subject" label="subject" placeholder="Subject" />
              <ManagedTextInput<MessageSchema> name="message" label="message" placeholder="Body of the message" numberOfLines={8} multiline />

              {isPending && <Label className="mt-4">Submitting</Label>}
            </FormProvider>
          </View>
          <Button
            onPress={form.handleSubmit(onSend)}
            accessibilityLabel={t('accessibility.submit_message')}
            accessibilityHint={t('accessibility.submit_message_hint')}
            accessibilityRole="button"
          >
            Submit
          </Button>
        </Floater>
      </ScrollView>
    </>
  )
}
