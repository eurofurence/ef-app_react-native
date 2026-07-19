import { eq, useLiveQuery } from '@tanstack/react-db'
import { useLocalSearchParams } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'
import { appStyles } from '@/components/AppStyles'
import { DealerContent } from '@/components/dealers/DealerContent'
import { shareDealer } from '@/components/dealers/Dealers.common'
import { platformShareIcon } from '@/components/generic/atoms/Icon'
import { Floater, padFloater } from '@/components/generic/containers/Floater'
import { Header } from '@/components/generic/containers/Header'
import { NotFoundContent } from '@/components/NotFoundContent'
import { dealersFullCollection } from '@/data/collections/content/DealersFull'

export default function DealerItem() {
  const { t } = useTranslation('Dealer')
  const { id } = useLocalSearchParams<{ id: string }>()
  const { data: dealer } = useLiveQuery(
    {
      id: 'dealers-item',
      query: (q) =>
        q
          .from({ item: dealersFullCollection })
          .where(({ item }) => eq(item.Id, id))
          .findOne(),
    },
    [id]
  )

  const dealerName = dealer?.DisplayName ?? t('viewing_dealer')

  return (
    <ScrollView
      style={StyleSheet.absoluteFill}
      stickyHeaderIndices={[0]}
      stickyHeaderHiddenOnScroll
      accessibilityLabel={t('accessibility.page_description')}
      accessibilityHint={t('accessibility.scroll_view_hint')}
    >
      <Header
        secondaryIcon={dealer ? platformShareIcon : undefined}
        secondaryPress={dealer ? () => shareDealer(dealer) : undefined}
      >
        {dealerName}
      </Header>
      <Floater contentStyle={appStyles.trailer}>
        {!dealer ? (
          <NotFoundContent
            accessibilityStatus={t('accessibility.dealer_not_found')}
            title={t('dealer_not_found_title')}
            message={t('dealer_not_found_message')}
          />
        ) : (
          <DealerContent dealer={dealer} parentPad={padFloater} />
        )}
      </Floater>
    </ScrollView>
  )
}
