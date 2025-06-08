import { Alert } from 'react-native'
import { ConfirmPromptContent } from '@/util/ConfirmPromptContent'

export function confirmPrompt(content: ConfirmPromptContent): Promise<boolean | null> {
  return new Promise<boolean | null>((resolve) =>
    Alert.alert(
      content.title,
      content.body,
      [
        {
          text: 'confirmText' in content ? content.confirmText : content.deleteText,
          style: 'confirmText' in content ? undefined : 'destructive',
          onPress: () => resolve(true),
        },
        {
          text: content.cancelText,
          style: 'cancel',
          onPress: () => resolve(false),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    )
  )
}
