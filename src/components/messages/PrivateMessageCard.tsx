import { format } from 'date-fns'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Icon } from '../generic/atoms/Icon'
import { Label } from '../generic/atoms/Label'
import { Col } from '../generic/containers/Col'
import { Row } from '../generic/containers/Row'
import { appStyles } from '../AppStyles'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

import { CommunicationRecord } from '@/context/data/types.api'
import { Pressable } from '@/components/generic/Pressable'

export type PrivateMessageCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  item: CommunicationRecord
  onPress: (item: CommunicationRecord) => void
}

export const PrivateMessageCard: FC<PrivateMessageCardProps> = ({ containerStyle, style, item, onPress }) => {
  const { t } = useTranslation('PrivateMessageList')
  const styleContainer = useThemeBackground('background')

  const readStatus = item.ReadDateTimeUtc === null ? t('unread') : t('read')
  const formattedTime = format(new Date(item.CreatedDateTimeUtc), 'PPpp')

  return (
    <View style={containerStyle}>
      <Pressable
        style={[styles.container, appStyles.shadow, styleContainer, style]}
        onPress={() => onPress?.(item)}
        accessibilityRole="button"
        accessibilityLabel={t('accessibility.message_card', {
          subject: item.Subject,
          status: readStatus,
          time: formattedTime,
        })}
        accessibilityHint={t('accessibility.message_card_hint')}
        accessibilityState={{
          selected: false,
          disabled: false,
        }}
      >
        <Row style={styles.main}>
          <Col style={styles.title}>
            <Label
              type="h4"
              className="mb-3"
              variant={item.ReadDateTimeUtc === null ? 'bold' : 'regular'}
              color={item.ReadDateTimeUtc === null ? 'important' : 'soften'}
              ellipsizeMode="tail"
            >
              {item.Subject}
            </Label>
            <Label
              color={item.ReadDateTimeUtc === null ? 'important' : 'soften'}
              accessibilityLabel={t('accessibility.message_status_time', {
                status: readStatus,
                time: formattedTime,
              })}
            >
              {t('message_item_subtitle', {
                status: readStatus,
                time: formattedTime,
              })}
            </Label>
          </Col>
          <View style={styles.itemChevron} accessibilityElementsHidden={true} importantForAccessibility="no">
            <Icon name="chevron-right" size={30} />
          </View>
        </Row>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    marginVertical: 15,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    padding: 12,
  },
  title: {
    flex: 6,
  },
  itemChevron: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 50,
  },
})
