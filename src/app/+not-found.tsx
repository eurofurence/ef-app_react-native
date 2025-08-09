import { Link, Stack, usePathname } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { useTouchTarget } from '@/hooks/util/useTouchTarget'
import { useAccessibilityFocus } from '@/hooks/util/useAccessibilityFocus'
import { useTranslation } from 'react-i18next'

export default function NotFoundScreen() {
  const { t: a11y } = useTranslation('Accessibility')
  const backgroundStyle = useThemeBackground('background')
  const backgroundPathStyle = useThemeBackground('inverted')
  const path = usePathname()
  const [pathStable] = useState(path)
  const [announcementMessage, setAnnouncementMessage] = useState('')

  // Focus management for the main content
  const mainContentRef = useAccessibilityFocus<View>(200)

  // Touch target for the home link
  const homeLinkStyle = useTouchTarget(44)

  // Announce the error page to screen readers
  useEffect(() => {
    const message = a11y('page_not_found', { path: pathStable })
    setAnnouncementMessage(message)
  }, [pathStable, a11y])

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />

      {/* Status message for screen reader announcement */}
      <StatusMessage message={announcementMessage} type="assertive" visible={false} />

      <View
        style={[styles.container, backgroundStyle]}
        ref={mainContentRef}
        accessibilityLabel={a11y('not_found_content')}
        accessibilityRole="text"
      >
        <Label type="h1" accessibilityRole="header">
          {a11y('page_not_found_title')}
        </Label>

        <Label
          type="regular"
          color="invText"
          style={[backgroundPathStyle, styles.path]}
          accessibilityLabel={a11y('requested_path')}
          accessibilityHint={a11y('requested_path_hint')}
        >
          {pathStable}
        </Label>

        <Link
          href="/"
          style={[styles.link, homeLinkStyle]}
          accessibilityLabel={a11y('go_home')}
          accessibilityHint={a11y('go_home_hint')}
          accessibilityRole="button"
          replace
        >
          <Label type={'underlined'}>{a11y('go_home_text')}</Label>
        </Link>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  path: {
    marginVertical: 20,
    borderRadius: 5,
    padding: 5,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
})