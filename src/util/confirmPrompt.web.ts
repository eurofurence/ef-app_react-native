import { ConfirmPromptContent } from '@/util/ConfirmPromptContent'

export function confirmPrompt(content: ConfirmPromptContent): Promise<boolean | null> {
  return Promise.resolve(confirm(content.title + '\r\n\r\n' + content.body))
}
