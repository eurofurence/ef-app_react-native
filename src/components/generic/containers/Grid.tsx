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
  // Get an array of children, padded for necessary chunks.
  const childrenArray = useMemo(() => {
    const result = Array.isArray(children)
      ? [...children].filter(Boolean)
      : [children].filter(Boolean)
    while (result.length % cols !== 0) result.push(null)
    return result
  }, [children, cols])

  let itemCounter = 0

  return (
    <Col style={style} type='stretch'>
      {chunk(childrenArray, cols).map((row) => {
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
