import moment from "moment";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";
import { Row } from "../../components/Containers/Row";
import { useNow } from "../../hooks/useNow";
import { useAppDispatch, useAppSelector } from "../../store";
import { enableTimeTravel, ONE_DAY, ONE_HOUR, ONE_MINUTE, ONE_MONTH, ONE_WEEK, resetTravel, travelBackward, travelForward } from "../../store/timetravel.slice";

/**
 * A self-contained component to adjust time travel settings. Useful for development.
 */
export const TimeTravel = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation("TimeTravel");
    const [now] = useNow();
    const { amount, enabled } = useAppSelector((state) => state.timetravel);

    return (
        <View testID={"TimeTravel"}>
            <Section title={t("title")} icon={"airplane"} subtitle={t("subtitle")} />
            <Label mb={5}>{t("originalTime", { time: moment().format("llll") })}</Label>
            <Label mb={5}>{t("currentTime", { time: now.format("llll") })}</Label>
            <Label mb={5}>{t("difference", { diff: moment.duration(amount, "millisecond").humanize() })}</Label>
            <Row>
                <Button style={styles.button} outline={enabled} onPress={() => dispatch(enableTimeTravel(!enabled))}>
                    Enable
                </Button>
                <Button style={styles.button} onPress={() => dispatch(resetTravel())}>
                    {t("reset")}
                </Button>
            </Row>
            <Row>
                <Col>
                    <Button style={styles.button} onPress={() => dispatch(travelForward(ONE_MINUTE))}>
                        +1 minute
                    </Button>
                    <Button style={styles.button} onPress={() => dispatch(travelForward(ONE_HOUR))}>
                        +1 hour
                    </Button>
                    <Button style={styles.button} onPress={() => dispatch(travelForward(ONE_DAY))}>
                        +1 day
                    </Button>
                    <Button style={styles.button} onPress={() => dispatch(travelForward(ONE_WEEK))}>
                        +1 week
                    </Button>
                    <Button style={styles.button} onPress={() => dispatch(travelForward(ONE_MONTH))}>
                        +1 month
                    </Button>
                </Col>
                <Col>
                    <Button style={styles.button} onPress={() => dispatch(travelBackward(ONE_MINUTE))}>
                        -1 minute
                    </Button>
                    <Button style={styles.button} onPress={() => dispatch(travelBackward(ONE_HOUR))}>
                        -1 hour
                    </Button>
                    <Button style={styles.button} onPress={() => dispatch(travelBackward(ONE_DAY))}>
                        -1 day
                    </Button>
                    <Button style={styles.button} onPress={() => dispatch(travelBackward(ONE_WEEK))}>
                        -1 week
                    </Button>
                    <Button style={styles.button} onPress={() => dispatch(travelBackward(ONE_MONTH))}>
                        -1 month
                    </Button>
                </Col>
            </Row>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        margin: 5,
    },
});
