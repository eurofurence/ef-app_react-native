import { Link } from 'expo-router'
import { openBrowserAsync } from 'expo-web-browser'
import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { confirmPrompt } from '@/util/confirmPrompt'
import { ConfirmPromptContent } from '@/util/ConfirmPromptContent'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

// TODO: I don't think this works.
export function ExternalLink({ href, ...rest }: Props) {
  const { t: a11y } = useTranslation('Accessibility')

  const handleExternalPress = async (event: any) => {
    if (Platform.OS !== 'web') {
      // Prevent the default behavior of linking to the default browser on native.
      event.preventDefault()
      // Prompt user with a warning before leaving the app
      const prompt = await confirmPrompt({
        title: a11y('external_link_no_prompt'),
        body: a11y('outside_link'),
        confirmText: a11y('confirm'),
        cancelText: a11y('cancel'),
      })
      if (prompt === true) {
        await openBrowserAsync(href)
      }
    }
  }

  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      style={[rest.style, appStyles.minTouchSize]}
      accessibilityLabel={a11y('external_link', { url: href })}
      accessibilityHint={a11y('external_link_hint')}
      accessibilityRole="link"
      onPress={handleExternalPress}
    />
  )
}

export async function handleExternalLink(href: string, content: ConfirmPromptContent) {
  if (Platform.OS !== 'web') {
    // Prompt user with a warning before leaving the app
    const prompt = await confirmPrompt({
      title: content.title,
      body: content.body,
      confirmText: 'confirmText' in content ? content.confirmText : 'Confirm',
      cancelText: content.cancelText,
    })
    if (prompt === true) {
      await openBrowserAsync(href)
    }
  } else {
    await openBrowserAsync(href)
  }
}
