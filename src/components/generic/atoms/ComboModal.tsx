import { Modal, StyleSheet, View, ScrollView } from 'react-native'
import * as React from 'react'
import { ForwardedRef, forwardRef, ReactNode, useImperativeHandle, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Fuse from 'fuse.js'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button } from '@/components/generic/containers/Button'
import { Search } from '@/components/generic/atoms/Search'
import { Label } from '@/components/generic/atoms/Label'
import { useThemeBackground, useThemeBorder } from '@/hooks/themes/useThemeHooks'
import { Row } from '@/components/generic/containers/Row'
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
  pick(options: readonly T[], selected?: readonly T[]): Promise<readonly T[] | null>
}

// eslint-disable-next-line react/display-name
export const ComboModal = forwardRef(<T,>({ title, clear, getKey, getLabel, cancelText, confirmText, children }: ComboModalProps<T>, ref: ForwardedRef<ComboModalRef<T>>) => {
  const { t: a11y } = useTranslation('Accessibility')
  const styleBackground = useThemeBackground('background')
  const styleBorder = useThemeBorder('secondary')
  const styleDismiss = useThemeBackground('darken')
  const insets = useSafeAreaInsets()

  const [resolve, setResolve] = useState<((result: T[] | null) => void) | undefined>(undefined)
  const [visible, setVisible] = useState(false)
  const [options, setOptions] = useState<T[]>([])
  const [selected, setSelected] = useState<T[]>([])
  const [filter, setFilter] = useState<string>('')

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fuse = useMemo(() => new Fuse(options, { keys: [{ name: 'Label', getFn: getLabel }] }), [options])

  const filtered = useMemo(() => (filter.length ? fuse.search(filter).map((item) => item.item) : null), [filter, fuse])

  const clearSelected = () => setSelected([])

  const toggleSelected = (item: T) => (selected.includes(item) ? setSelected(selected.filter((other) => item !== other)) : setSelected([...selected, item]))

  const toggleSelectedFirstResult = () => {
    if (!filtered?.length) return
    toggleSelected(filtered[0])
    setFilter('')
  }

  useImperativeHandle(
    ref,
    () => ({
      pick(options: T[], selected?: T[]): Promise<T[] | null> {
        if (visible) throw new Error('Already open')

        setOptions(options)
        setSelected(selected ?? [])
        setFilter('')

        return new Promise<T[] | null>((resolve) => {
          setResolve(() => resolve)
          setVisible(true)
        })
      },
    }),
    [visible]
  )

  const cancel = () => {
    resolve?.(null)
    setResolve(undefined)
    setVisible(false)
  }
  const confirm = () => {
    resolve?.(selected)
    setResolve(undefined)
    setVisible(false)
  }

  return (
    <Modal visible={visible} transparent={true} onRequestClose={() => cancel()} accessibilityViewIsModal={true}>
      <GestureHandlerRootView>
        <View style={[styleDismiss, StyleSheet.absoluteFill]} accessibilityElementsHidden={true} importantForAccessibility="no" />
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
          accessibilityLabel={title || a11y('selection_modal', { defaultValue: 'Selection dialog' })}
        >
          {!title ? null : <Label type="h3">{title}</Label>}

          <Search filter={filter} setFilter={setFilter} submit={() => toggleSelectedFirstResult()} placeholder={a11y('filter_options', { defaultValue: 'Filter options' })} />

          {children}

          <View style={{ marginTop: 20, marginBottom: 20 }}>
            {clear !== false && (
              <Button
                key="clear"
                outline={selected.length === 0}
                onPress={() => clearSelected()}
                iconRight="checkbox-multiple-blank-outline"
                accessibilityLabel={a11y('clear_selection', { defaultValue: 'Clear all selections' })}
                accessibilityHint={a11y('clear_selection_hint', { defaultValue: 'Removes all currently selected items' })}
              >
                Clear
              </Button>
            )}
          </View>

          <ScrollView
            style={{ flex: 1, marginTop: 20, marginBottom: 20 }}
            contentContainerStyle={{ gap: 10 }}
            accessibilityLabel={a11y('options_list', { defaultValue: 'Available options' })}
          >
            {(filtered ?? options).map((item) => {
              const itemSelected = selected.includes(item)
              const itemLabel = getLabel(item)
              return (
                <Button
                  key={getKey(item)}
                  outline={!itemSelected}
                  onPress={() => toggleSelected(item)}
                  iconRight={itemSelected ? 'checkbox-marked-outline' : undefined}
                  accessibilityLabel={itemLabel}
                  accessibilityHint={
                    itemSelected ? a11y('deselect_item_hint', { defaultValue: 'Tap to deselect this item' }) : a11y('select_item_hint', { defaultValue: 'Tap to select this item' })
                  }
                >
                  {itemLabel}
                </Button>
              )
            })}
          </ScrollView>

          <Row>
            <Button
              containerStyle={styles.rowLeft}
              outline={true}
              onPress={cancel}
              accessibilityLabel={cancelText ?? a11y('cancel', { defaultValue: 'Cancel' })}
              accessibilityHint={a11y('cancel_hint', { defaultValue: 'Closes dialog without saving changes' })}
            >
              {cancelText ?? 'Cancel'}
            </Button>
            <Button
              containerStyle={styles.rowRight}
              outline={false}
              onPress={confirm}
              accessibilityLabel={confirmText ?? a11y('confirm', { defaultValue: 'Confirm' })}
              accessibilityHint={a11y('confirm_hint', { defaultValue: 'Saves selections and closes dialog' })}
            >
              {confirmText ?? 'Confirm'}
            </Button>
          </Row>
        </View>
      </GestureHandlerRootView>
    </Modal>
  )
}) as <T>(props: ComboModalProps<T> & { ref: ForwardedRef<ComboModalRef<T>> }) => React.JSX.Element

const styles = StyleSheet.create({
  rowLeft: {
    flex: 1,
    marginRight: 8,
  },
  rowRight: {
    flex: 1,
    marginLeft: 8,
  },
})
