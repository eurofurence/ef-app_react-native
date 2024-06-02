import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";
import { Row } from "../../components/Containers/Row";
import { conName } from "../../configuration";
import { useNow } from "../../hooks/time/useNow";
import { useAppDispatch, useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence.selectors";
import { enableTimeTravel, ONE_HOUR, ONE_MINUTE, resetTravel, travelBackward, travelForward, travelToDate } from "../../store/timetravel.slice";

/**
 * A self-contained component to adjust time travel settings. Useful for development.
 */
export const TimeTravel = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation("TimeTravel");
    const [now] = useNow();
    const { amount, enabled } = useAppSelector((state) => state.timetravel);
    const days = useAppSelector(eventDaysSelectors.selectAll);
    const [weekBefore, weekAfter] = useMemo(
        () =>
            !days.length
                ? [null, null]
                : [
                      moment(days[0].Date).subtract(1, "week").toISOString(),
                      moment(days[days.length - 1].Date)
                          .add(1, "week")
                          .toISOString(),
                  ],
        [days],
    );

    return (
        <View testID={"TimeTravel"}>
            <Section title={t("title")} icon={"airplane"} subtitle={t("subtitle")} />
            <Label mb={5}>{t("originalTime", { time: moment().format("llll") })}</Label>
            <Label mb={5}>{t("currentTime", { time: now.format("llll") })}</Label>
            <Label mb={5}>{t("difference", { diff: moment.duration(amount, "millisecond").humanize() })}</Label>
            <Row style={styles.row}>
                <Button style={styles.button} outline={enabled} onPress={() => dispatch(enableTimeTravel(!enabled))}>
                    {enabled ? t("disable") : t("enable")}
                </Button>
                <Button style={styles.button} onPress={() => dispatch(resetTravel())}>
                    {t("reset")}
                </Button>
            </Row>
            <Row style={styles.row}>
                <Button style={styles.button} icon="chevron-left" onPress={() => dispatch(travelBackward(ONE_HOUR))}>
                    1h
                </Button>
                <Button style={styles.button} icon="chevron-left" onPress={() => dispatch(travelBackward(ONE_MINUTE))}>
                    1m
                </Button>
                <Button style={styles.button} iconRight="chevron-right" onPress={() => dispatch(travelForward(ONE_MINUTE))}>
                    1m
                </Button>
                <Button style={styles.button} iconRight="chevron-right" onPress={() => dispatch(travelForward(ONE_HOUR))}>
                    1h
                </Button>
            </Row>
            <Col style={styles.row} type="stretch">
                {!weekBefore ? null : (
                    <Button style={styles.button} icon="calendar-arrow-left" onPress={() => dispatch(travelToDate(weekBefore))}>
                        {t("week_before", { conName })}
                    </Button>
                )}
                {!days
                    ? null
                    : days.map((day) => (
                          <Button key={day.Id} style={styles.button} icon="calendar-cursor" onPress={() => dispatch(travelToDate(moment(day.Date).toISOString()))}>
                              {day.Name}
                          </Button>
                      ))}
                {!weekAfter ? null : (
                    <Button style={styles.button} icon="calendar-arrow-right" onPress={() => dispatch(travelToDate(weekAfter))}>
                        {t("week_after", { conName })}
                    </Button>
                )}
            </Col>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        flex: 1,
        margin: 5,
        flexGrow: 1,
    },
    row: {
        marginTop: 15,
    },
});
