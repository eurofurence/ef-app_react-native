import { format } from 'date-fns'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Icon } from '../generic/atoms/Icon'
import { Label } from '../generic/atoms/Label'
import { Col } from '../generic/containers/Col'
import { Row } from '../generic/containers/Row'
import { appStyles } from '../AppStyles'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

import { CommunicationRecord } from '@/context/data/types'

export type PrivateMessageCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  item: CommunicationRecord
  onPress: (item: CommunicationRecord) => void
}

export const PrivateMessageCard: FC<PrivateMessageCardProps> = ({ containerStyle, style, item, onPress }) => {
  const { t } = useTranslation('PrivateMessageList')
  const styleContainer = useThemeBackground('background')

  return (
    <TouchableOpacity containerStyle={containerStyle} style={[styles.container, appStyles.shadow, styleContainer, style]} onPress={() => onPress?.(item)}>
      <Row style={styles.main}>
        <Col style={styles.title}>
          <Label type="h4" mb={10} variant={item.ReadDateTimeUtc === null ? 'bold' : 'regular'} color={item.ReadDateTimeUtc === null ? 'important' : 'soften'} ellipsizeMode="tail">
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
    </TouchableOpacity>
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
