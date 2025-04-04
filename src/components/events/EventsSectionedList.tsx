import { FlashList } from '@shopify/flash-list'
import { FC, ReactElement, useCallback, useMemo } from 'react'
import { StyleSheet, Vibration } from 'react-native'

import { router } from 'expo-router'
import { EventSection, EventSectionProps } from './EventSection'
import { EventCard, EventDetailsInstance } from './EventCard'
import { useThemeName } from '@/hooks/themes/useThemeHooks'
import { findIndices } from '@/util/findIndices'
import { useCache } from '@/context/data/DataCache'
import { EventDetails } from '@/context/data/types'
import { SectionProps } from '@/components/generic/atoms/Section'

/**
 * The properties to the component.
 */
export type EventsSectionedListProps = {
    leader?: ReactElement;
    eventsGroups: (EventSectionProps | EventDetailsInstance)[];
    select?: (event: EventDetails) => void;
    empty?: ReactElement;
    trailer?: ReactElement;
    cardType?: 'duration' | 'time';
    sticky?: boolean;
    padEnd?: boolean;
};

function getItemType(item: (SectionProps | EventDetailsInstance)) {
    return 'details' in item ? 'row' : 'sectionHeader'
}

function keyExtractor(item: (SectionProps | EventDetailsInstance)) {
    return 'details' in item ? item.details.Id : item.title
}

export const EventsSectionedList: FC<EventsSectionedListProps> = ({ leader, eventsGroups, select, empty, trailer, cardType = 'duration', sticky = true, padEnd = true }) => {
    const theme = useThemeName()
    const { isSynchronizing, synchronizeUi } = useCache()
    const stickyIndices = useMemo(() => (sticky ? findIndices(eventsGroups, (item) => !('details' in item)) : undefined), [eventsGroups, sticky])

    const onPress = useCallback((event: EventDetails) => {
        router.navigate({
            pathname: '/events/[eventId]',
            params: { eventId: event.Id },
        })
    }, [])

    const onLongPress = useCallback(
        (event: EventDetails) => {
            Vibration.vibrate(50)
            select?.(event)
        },
        [select],
    )

    const renderItem = useCallback(({ item }: { item: (SectionProps | EventDetailsInstance) }) => {
        if ('details' in item) {
            return <EventCard
                containerStyle={styles.item}
                event={item}
                type={cardType}
                onPress={onPress}
                onLongPress={onLongPress} />
        } else {
            return <EventSection
                style={styles.item}
                title={item.title}
                subtitle={item.subtitle}
                icon={item.icon} />
        }
    }, [cardType, onLongPress, onPress])

    return (
        <FlashList
            refreshing={isSynchronizing}
            onRefresh={synchronizeUi}
            contentContainerStyle={padEnd ? styles.container : undefined}
            scrollEnabled={true}
            stickyHeaderIndices={stickyIndices}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={eventsGroups}
            getItemType={getItemType}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={110}
            extraData={theme}
        />
    )
}

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 20,
    },
    container: {
        paddingBottom: 100,
    },
})
