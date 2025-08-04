import { format } from 'date-fns'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { Pressable } from '@/components/generic/Pressable'
import { Icon } from '../generic/atoms/Icon'
import { Label } from '../generic/atoms/Label'
import { Col } from '../generic/containers/Col'
import { Row } from '../generic/containers/Row'
import { appStyles } from '../AppStyles'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

import { CommunicationRecord } from '@/context/data/types.api'

export type PrivateMessageCardProps = {
  style?: ViewStyle
  item: CommunicationRecord
  onPress: (item: CommunicationRecord) => void
}

export const PrivateMessageCard: FC<PrivateMessageCardProps> = ({ style, item, onPress }) => {
  const { t } = useTranslation('PrivateMessageList')
  const styleContainer = useThemeBackground('background')

  return (
    <Pressable style={[styles.container, appStyles.shadow, styleContainer, style]} onPress={() => onPress?.(item)}>
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
          <Label color={item.ReadDateTimeUtc === null ? 'important' : 'soften'}>
            {t('message_item_subtitle', {
              status: item.ReadDateTimeUtc === null ? t('unread') : t('read'),
              time: format(new Date(item.CreatedDateTimeUtc), 'PPpp'),
            })}
          </Label>
        </Col>
        <View style={styles.itemChevron}>
          <Icon name="chevron-right" size={30} />
        </View>
      </Row>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    marginVertical: 15,
    borderRadius: 16,
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
