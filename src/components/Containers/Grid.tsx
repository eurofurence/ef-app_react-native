import { chunk } from "lodash";
import { FC, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Col } from "./Col";
import { Row } from "./Row";

export interface GridProps {
    style?: StyleProp<ViewStyle>;
    cols?: number;
}
export const Grid: FC<GridProps> = ({ style, cols = 2, children }) => {
    const childrenArray = useMemo(() => (Array.isArray(children) ? children : [children]), [children]);

    return (
        <Col style={style} type="stretch">
            {chunk(childrenArray, cols).map((row, y) => (
                <Row key={y} style={styles.distributed} type="stretch">
                    {row.map((item, y) => (
                        <View key={y} style={styles.distributed}>
                            {item}
                        </View>
                    ))}
                </Row>
            ))}
        </Col>
    );
};

const styles = StyleSheet.create({
    distributed: {
        flex: 1,
    },
});
