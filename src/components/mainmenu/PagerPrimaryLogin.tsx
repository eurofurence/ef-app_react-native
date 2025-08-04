import React from 'react'
import { StyleSheet } from 'react-native'
import { Pressable } from '@/components/generic/Pressable'
import { useTranslation } from 'react-i18next'

import { Claims } from '@/context/auth/Auth'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { Image } from '@/components/generic/atoms/Image'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { Col } from '@/components/generic/containers/Col'
import { Row } from '@/components/generic/containers/Row'

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
    <Row style={styles.padding} type="start" variant="center">
      <Pressable disabled={!loggedIn || !onProfile} onPress={() => onProfile?.()} accessibilityRole="button" accessibilityLabel="Profile">
        <Col type="center">
          <Image
            style={[avatarBackground, styles.avatarCircle]}
            source={claim?.avatar ?? require('@/assets/static/ych.png')}
            contentFit="contain"
            cachePolicy="memory-disk"
            priority="high"
          />
        </Col>
        {!claim?.name ? null : (
          <Label style={styles.name} type="minor" className="mt-1" ellipsizeMode="tail" numberOfLines={1}>
            {claim.name}
          </Label>
        )}
      </Pressable>

      {loggedIn ? (
        <Button style={styles.button} icon="message" onPress={onMessages}>
          {t('open_messages')}
        </Button>
      ) : (
        <Button style={styles.button} iconRight="login" onPress={onLogin}>
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
  button: {
    flexGrow: 1,
    flexShrink: 1,
    marginLeft: 16,
  },
  name: {
    maxWidth: 60,
    textAlign: 'center',
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
})
