import { Link } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { Label } from '@/components/generic/atoms/Label'
import { StatusMessage } from '@/components/generic/atoms/StatusMessage'

export type NotFoundContentProps = {
  accessibilityStatus: string
  title: string
  message: string
}
export function NotFoundContent({ accessibilityStatus, title, message }: NotFoundContentProps) {
  const { t: a11y } = useTranslation('Accessibility')

  return (
    <>
      {/* Status message for screen reader announcement */}
      <StatusMessage message={accessibilityStatus} type="assertive" visible={false} />

      <View className="items-center pt-[20vh]">
        <Label type="h1" accessibilityRole="header">
          {title}
        </Label>
        <Label className="mt-5" type="regular" accessibilityRole="text">
          {message}
        </Label>

        <Link
          className="mt-4 py-4"
          href="/"
          style={appStyles.minTouchSize}
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
