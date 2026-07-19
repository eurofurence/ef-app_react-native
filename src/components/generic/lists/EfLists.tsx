import type { EfEntity } from '@/data/types/EfEntity'
import { FlashList, type FlashListProps, type ListRenderItem, type ListRenderItemInfo } from '@shopify/flash-list'
import { useMemo } from 'react'

export function getItemKey<TSection, TItem extends EfEntity>(item: TSection | TItem, index: number) {
  if (typeof item === 'object' && item !== null && 'Id' in item)
    return item.Id
  if (typeof item === 'string')
    return item
  if (typeof item === 'number')
    return item.toString()
  return index.toString()
}

export function getItemType<TSection, TItem extends EfEntity>(item: TSection | TItem) {
  return typeof item === 'object' && item !== null && 'Id' in item ? 'item' : 'section'
}

export type EfListProps<TItem extends EfEntity> = FlashListProps<TItem>

export function EfList<TItem extends EfEntity>(
  props: EfListProps<TItem>) {
  return <FlashList {...props} keyExtractor={getItemKey} />
}


export type EfSectionListProps<TSection, TItem extends EfEntity> =
  Omit<FlashListProps<TSection | TItem>, 'getItemType' | 'keyExtractor' | 'renderItem' | 'stickyHeaderIndices'> & {
  renderSection: ListRenderItem<TSection>;
  renderItem: ListRenderItem<TItem>;
  sectionsSticky?: boolean;
}

export function EfSectionList<TSection, TItem extends EfEntity>(
  {
    data,
    renderSection,
    renderItem,
    sectionsSticky = true,
    ...props
  }: EfSectionListProps<TSection, TItem>) {

  const stickyIndices = useMemo(() => {
    if (!sectionsSticky) return undefined
    if (!data) return undefined
    const indices: number[] = []
    for (let i = 0; i < data.length; i++)
      if (getItemType(data[i]) === 'section') indices.push(i)
    return indices
  }, [sectionsSticky, data])

  return <FlashList {...props}
                    stickyHeaderIndices={stickyIndices}
                    data={data}
                    getItemType={getItemType}
                    keyExtractor={getItemKey}
                    renderItem={info => getItemType(info.item) === 'item'
                      ? renderItem(info as ListRenderItemInfo<TItem>)
                      : renderSection(info as ListRenderItemInfo<TSection>)}
  />
}
