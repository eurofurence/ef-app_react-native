import { Link, Stack, usePathname } from 'expo-router'
import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Label } from '@/components/generic/atoms/Label'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

export default function NotFoundScreen() {
  const backgroundStyle = useThemeBackground('background')
  const backgroundPathStyle = useThemeBackground('inverted')
  const path = usePathname()
  const [pathStable] = useState(path)
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={[styles.container, backgroundStyle]}>
        <Label type="h1">This screen does not exist.</Label>
        <Label type="regular" color="invText" style={[backgroundPathStyle, styles.path]}>
          {pathStable}
        </Label>
        <Link href="/" style={styles.link} replace>
          <Label type={'underlined'}>Go to home screen!</Label>
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
