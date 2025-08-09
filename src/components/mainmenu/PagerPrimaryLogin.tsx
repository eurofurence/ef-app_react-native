import React from 'react'
import { StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'

import { Claims } from '@/context/auth/Auth'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { Col } from '@/components/generic/containers/Col'
import { Row } from '@/components/generic/containers/Row'
import { Pressable } from '@/components/generic/Pressable'

type PagerPrimaryLoginProps = {
  loggedIn: boolean
  claim: Claims | null
  onMessages?: () => void
  onLogin?: () => void
  onProfile?: () => void
}

export function PagerPrimaryLogin({ loggedIn, claim, onMessages, onLogin, onProfile }: PagerPrimaryLoginProps) {
  const { t } = useTranslation('Menu')
  const avatarBackground = useThemeBackground('primary')

  return (
    <Row style={styles.padding} type="start" variant="center" accessibilityLabel={t('accessibility.login_section')}>
      <Pressable
        disabled={!loggedIn || !onProfile}
        onPress={() => onProfile?.()}
        accessibilityRole="button"
        accessibilityLabel={loggedIn && claim?.name ? t('accessibility.profile_button_with_name', { name: claim.name }) : t('accessibility.profile_button')}
        accessibilityHint={loggedIn ? t('accessibility.profile_button_hint') : t('accessibility.profile_button_disabled_hint')}
        accessibilityState={{ disabled: !loggedIn || !onProfile }}
      >
        <Col type="center">
          <Image
            style={[avatarBackground, styles.avatarCircle]}
            source={claim?.avatar ?? require('@/assets/static/ych.png')}
            contentFit="contain"
            cachePolicy="memory-disk"
            priority="high"
            accessibilityRole="image"
            accessibilityLabel={claim?.name ? t('accessibility.avatar_with_name', { name: claim.name }) : t('accessibility.avatar_default')}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          />
        </Col>
        {!claim?.name ? null : (
          <Label style={styles.name} type="minor" className="mt-1" ellipsizeMode="tail" numberOfLines={1} accessibilityElementsHidden={true} importantForAccessibility="no">
            {claim.name}
          </Label>
        )}
      </Pressable>

      {loggedIn ? (
        <Button
          containerStyle={styles.buttonContainer}
          style={styles.button}
          icon="message"
          onPress={onMessages}
          accessibilityLabel={t('accessibility.messages_button')}
          accessibilityHint={t('accessibility.messages_button_hint')}
        >
          {t('open_messages')}
        </Button>
      ) : (
        <Button
          containerStyle={styles.buttonContainer}
          style={styles.button}
          iconRight="login"
          onPress={onLogin}
          accessibilityLabel={t('accessibility.login_button')}
          accessibilityHint={t('accessibility.login_button_hint')}
        >
          {t('logged_in_now')}
        </Button>
      )}
    </Row>
  )
}

const styles = StyleSheet.create({
  padding: {
    paddingHorizontal: 30,
    paddingVertical: 15,
  },
  buttonContainer: {
    flexGrow: 1,
    flexShrink: 1,
  },
  name: {
    maxWidth: 60,
    textAlign: 'center',
  },
  button: {
    marginLeft: 16,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
})
