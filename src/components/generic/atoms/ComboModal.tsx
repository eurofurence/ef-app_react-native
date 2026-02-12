import Fuse from 'fuse.js'
import type * as React from 'react'
import {
  type ForwardedRef,
  forwardRef,
  type ReactNode,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, ScrollView, StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Label } from '@/components/generic/atoms/Label'
import { Search } from '@/components/generic/atoms/Search'
import { Button } from '@/components/generic/containers/Button'
import { Row } from '@/components/generic/containers/Row'
import {
  useThemeBackground,
  useThemeBorder,
} from '@/hooks/themes/useThemeHooks'
export type ComboModalProps<T> = {
  title?: string
  clear?: boolean
  getKey(item: T): string
  getLabel(item: T): string
  cancelText?: string
  confirmText?: string
  children?: ReactNode | undefined
}

export type ComboModalRef<T> = {
  pick(
    options: readonly T[],
    selected?: readonly T[],
    onChange?: (selected: readonly T[]) => void
  ): Promise<readonly T[] | null>
}

export const ComboModal = forwardRef(
  <T,>(
    { title, clear, getKey, getLabel, children }: ComboModalProps<T>,
    ref: ForwardedRef<ComboModalRef<T>>
  ) => {
    const { t: a11y } = useTranslation('Accessibility')
    const styleBackground = useThemeBackground('background')
    const styleBorder = useThemeBorder('secondary')
    const styleDismiss = useThemeBackground('darken')
    const insets = useSafeAreaInsets()

    const [resolve, setResolve] = useState<
      ((result: T[] | null) => void) | undefined
    >(undefined)
    const [visible, setVisible] = useState(false)
    const [options, setOptions] = useState<T[]>([])
    const [selected, setSelected] = useState<T[]>([])
    const [filter, setFilter] = useState<string>('')

    const onChangeRef = useRef<((selected: readonly T[]) => void) | undefined>(
      undefined
    )

    const fuse = useMemo(
      () => new Fuse(options, { keys: [{ name: 'Label', getFn: getLabel }] }),
      [options]
    )

    const filtered = useMemo(
      () =>
        filter.length ? fuse.search(filter).map((item) => item.item) : null,
      [filter, fuse]
    )

    const clearSelected = () => {
      setSelected([])
      onChangeRef.current?.([])
    }

    const toggleSelected = (item: T) => {
      const newSelected = selected.includes(item)
        ? selected.filter((other) => item !== other)
        : [...selected, item]
      setSelected(newSelected)
      onChangeRef.current?.(newSelected)
    }

    useImperativeHandle(
      ref,
      () => ({
        pick(
          options: T[],
          selected?: T[],
          onChange?: (selected: readonly T[]) => void
        ): Promise<T[] | null> {
          if (visible) throw new Error('Already open')

          setOptions(options)
          setSelected(selected ?? [])
          setFilter('')

          onChangeRef.current = onChange

          return new Promise<T[] | null>((resolve) => {
            setResolve(() => resolve)
            setVisible(true)
          })
        },
      }),
      [visible]
    )

    const close = () => {
      resolve?.(selected)
      setResolve(undefined)
      setVisible(false)
    }

    return (
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={() => close()}
        accessibilityViewIsModal={true}
      >
        <GestureHandlerRootView>
          <View
            style={[styleDismiss, StyleSheet.absoluteFill]}
            accessibilityElementsHidden={true}
            importantForAccessibility='no'
          />
          <View
            style={[
              styleBackground,
              styleBorder,
              {
                minHeight: '60%',
                flex: 1,
                flexShrink: 1,
                margin: 20,
                marginTop: Math.max(20, insets.top + 10),
                marginBottom: Math.max(90, insets.bottom + 20),
                borderRadius: 20,
                padding: 20,
                borderWidth: 2,
              },
            ]}
            accessibilityLabel={
              title ||
              a11y('selection_modal', { defaultValue: 'Selection dialog' })
            }
          >
            {!title ? null : <Label type='h3'>{title}</Label>}

            <Search
              filter={filter}
              setFilter={setFilter}
              placeholder={a11y('filter_options', {
                defaultValue: 'Filter options',
              })}
            />

            {children}

            <View style={{ marginTop: 20, marginBottom: 20 }}>
              {clear !== false && (
                <Button
                  key='clear'
                  outline={selected.length === 0}
                  onPress={() => clearSelected()}
                  iconRight='checkbox-multiple-blank-outline'
                  accessibilityLabel={a11y('clear_selection', {
                    defaultValue: 'Clear all selections',
                  })}
                  accessibilityHint={a11y('clear_selection_hint', {
                    defaultValue: 'Removes all currently selected items',
                  })}
                >
                  Clear
                </Button>
              )}
            </View>

            <ScrollView
              style={{ flex: 1, marginTop: 20, marginBottom: 20 }}
              contentContainerStyle={{ gap: 10 }}
              accessibilityLabel={a11y('options_list', {
                defaultValue: 'Available options',
              })}
            >
              {(filtered ?? options).map((item) => {
                const itemSelected = selected.includes(item)
                const itemLabel = getLabel(item)
                return (
                  <Button
                    key={getKey(item)}
                    outline={!itemSelected}
                    onPress={() => toggleSelected(item)}
                    iconRight={
                      itemSelected ? 'checkbox-marked-outline' : undefined
                    }
                    accessibilityLabel={itemLabel}
                    accessibilityHint={
                      itemSelected
                        ? a11y('deselect_item_hint', {
                            defaultValue: 'Tap to deselect this item',
                          })
                        : a11y('select_item_hint', {
                            defaultValue: 'Tap to select this item',
                          })
                    }
                  >
                    {itemLabel}
                  </Button>
                )
              })}
            </ScrollView>

            <Row>
              <Button
                containerStyle={{ flex: 1 }}
                outline={false}
                onPress={close}
                accessibilityLabel={a11y('close', { defaultValue: 'Close' })}
                accessibilityHint={a11y('close_hint', {
                  defaultValue: 'Closes dialog',
                })}
              >
                {a11y('close', { defaultValue: 'Close' })}
              </Button>
            </Row>
          </View>
        </GestureHandlerRootView>
      </Modal>
    )
  }
) as <T>(
  props: ComboModalProps<T> & { ref: ForwardedRef<ComboModalRef<T>> }
) => React.JSX.Element
