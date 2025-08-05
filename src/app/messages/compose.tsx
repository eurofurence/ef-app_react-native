import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ManagedTextInput } from '@/components/generic/forms/ManagedTextInput'
import { Button } from '@/components/generic/containers/Button'
import React, { useCallback } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Header } from '@/components/generic/containers/Header'
import { Floater } from '@/components/generic/containers/Floater'
import { useToastContext } from '@/context/ui/ToastContext'
import { useCommunicationsSendMutation } from '@/hooks/api/communications/useCommunicationsSendMutation'
import { ManagedChoiceButtons } from '@/components/generic/forms/ManagedChoiceButtons'
import { Label } from '@/components/generic/atoms/Label'
import { useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { Redirect } from 'expo-router'

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
  const { data: user } = useUserSelfQuery()

  const rolesAvailable = Boolean(user?.RoleMap)
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

  const onSend = useCallback(
    (args: MessageSchema) => {
      mutate(args, {
        onSuccess: () => toast('info', 'Message sent'),
        onError: () => toast('error', 'Failed to send message'),
      })
    },
    [mutate, toast]
  )
  if (rolesAvailable && !isAdmin && !isPrivateMessageSender) return <Redirect href="/messages" />

  return (
    <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]}>
      <Header>Compose message</Header>
      <Floater>
        <View style={{ marginVertical: 30, gap: 20 }}>
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
        <Button onPress={form.handleSubmit(onSend)}>Submit</Button>
      </Floater>
    </ScrollView>
  )
}
