import React, { FC, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Button, buttonIconSize } from '../generic/containers/Button'
import { Icon } from '../generic/atoms/Icon'
import { Label } from '../generic/atoms/Label'
import { useThemeBackground, useThemeColorValue } from '@/hooks/themes/useThemeHooks'
import { useCache } from '@/context/data/Cache'

type PrivateMessageLinkerProps = {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  open?: boolean
  onOpenMessages?: () => void
}

/**
 * Creates a link to the private messages screen
 */
export const PrivateMessageLinker: FC<PrivateMessageLinkerProps> = ({ containerStyle, style, onOpenMessages, open }) => {
  const prevOpen = useRef(open)
  const { t } = useTranslation('Menu')
  const styleBackground = useThemeBackground('notification')
  const { getValue, synchronizeUi } = useCache()
  const communications = getValue('communications')

  // Get all communications and filter unread ones
  const unread = useMemo(() => communications.filter((item) => !item.ReadDateTimeUtc), [communications])

  const iconColor = useThemeColorValue(!unread.length ? 'important' : 'invImportant')

  useEffect(() => {
    if (open === true && prevOpen.current !== open) {
      console.debug('Fetching new private messages')
      synchronizeUi()
    }
    prevOpen.current = open
  }, [open, synchronizeUi])

  return (
    <Button
      containerStyle={containerStyle}
      style={style}
      outline={!unread.length}
      iconRight={
        <View>
          <Icon name={unread.length ? 'email-multiple-outline' : 'email-open-multiple-outline'} size={buttonIconSize} color={iconColor} />
          {!unread.length ? null : (
            <View style={styles.indicatorArea}>
              <View style={styles.indicatorLocator}>
                <Label style={[styles.indicatorContent, styleBackground]} type="cap" color="white">
                  {unread.length}
                </Label>
              </View>
            </View>
          )}
        </View>
      }
      onPress={onOpenMessages}
    >
      {t('open_messages')}
    </Button>
  )
}

const styles = StyleSheet.create({
  indicatorArea: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  indicatorLocator: {
    position: 'absolute',
    top: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorContent: {
    fontSize: 8,
    position: 'absolute',
    textAlignVertical: 'center',
    textAlign: 'center',
    minWidth: 20,
    minHeight: 20,
    padding: 4,
    borderRadius: 99999,
  },
})
