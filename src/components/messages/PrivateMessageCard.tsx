import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, type ViewStyle } from 'react-native'
import { Pressable } from '@/components/generic/Pressable'
import type { EfPm } from '@/data/types/EfPm'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

import { appStyles } from '../AppStyles'
import { Icon } from '../generic/atoms/Icon'
import { Label } from '../generic/atoms/Label'
import { Col } from '../generic/containers/Col'
import { Row } from '../generic/containers/Row'

export type PrivateMessageCardProps = {
  containerStyle?: ViewStyle
  style?: ViewStyle
  item: EfPm
  onPress: (item: EfPm) => void
}

export function PrivateMessageCard({
  containerStyle,
  style,
  item,
  onPress,
}: PrivateMessageCardProps) {
  const { t } = useTranslation('PrivateMessageList')
  const styleContainer = useThemeBackground('background')

  const readStatus = item.ReadDateTimeUtc === null ? t('unread') : t('read')
  const formattedTime = format(new Date(item.CreatedDateTimeUtc), 'PPpp')

  return (
    <View style={containerStyle}>
      <Pressable
        style={[styles.container, appStyles.shadow, styleContainer, style]}
        onPress={() => onPress?.(item)}
        accessibilityRole='button'
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
              type='h4'
              className='mb-3'
              variant={item.ReadDateTimeUtc === null ? 'bold' : 'regular'}
              color={item.ReadDateTimeUtc === null ? 'important' : 'soften'}
              ellipsizeMode='tail'
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
          <View
            style={styles.itemChevron}
            accessibilityElementsHidden={true}
            importantForAccessibility='no'
          >
            <Icon name='chevron-right' size={30} />
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
