import { chunk } from 'lodash'
import { type FC, type PropsWithChildren, useMemo } from 'react'
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native'

import { Col } from './Col'
import { Row } from './Row'

/**
 * Arguments to the grid.
 */
export type GridProps = PropsWithChildren<{
  /**
   * The style passed to the root column.
   */
  style?: StyleProp<ViewStyle>
  /**
   * The number of columns to distribute as.
   */
  cols?: number
}>

export const Grid: FC<GridProps> = ({ style, cols = 2, children }) => {
  const rows = useMemo(() => {
    const items = (Array.isArray(children) ? children : [children]).filter(
      Boolean
    )
    const rows = chunk(items, cols)

    const last = rows[rows.length - 1]
    if (last && last.length < cols) {
      const missing = cols - last.length
      const lead = Math.floor(missing / 2)
      rows[rows.length - 1] = [
        ...Array(lead).fill(null),
        ...last,
        ...Array(missing - lead).fill(null),
      ]
    }
    return rows
  }, [children, cols])

  let itemCounter = 0

  return (
    <Col style={style} type='stretch'>
      {rows.map((row) => {
        const rowKey = `grid-row-${itemCounter}`
        return (
          <Row key={rowKey} style={styles.distributed} type='stretch'>
            {row.map((item) => {
              const itemKey = `grid-item-${itemCounter++}`
              return (
                <View key={itemKey} style={styles.distributed}>
                  {item}
                </View>
              )
            })}
          </Row>
        )
      })}
    </Col>
  )
}

const styles = StyleSheet.create({
  distributed: {
    flex: 1,
  },
})
