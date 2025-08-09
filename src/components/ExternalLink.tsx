import { Link } from 'expo-router'
import { openBrowserAsync } from 'expo-web-browser'
import { type ComponentProps } from 'react'
import { Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useTouchTarget } from '@/hooks/util/useTouchTarget'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

export function ExternalLink({ href, ...rest }: Props) {
  const { t: a11y } = useTranslation('Accessibility')
  const linkStyle = useTouchTarget(44)

  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      style={[rest.style, linkStyle]}
      accessibilityLabel={a11y('external_link', { url: href })}
      accessibilityHint={a11y('external_link_hint')}
      accessibilityRole="link"
      onPress={async (event) => {
        if (Platform.OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault()
          // Open the link in an in-app browser.
          await openBrowserAsync(href)
        }
      }}
    />
  )
}
