import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { format, addWeeks, subWeeks } from 'date-fns';
import { Label } from '@/components/generic/atoms/Label';
import { Section } from '@/components/generic/atoms/Section';
import { Button } from '@/components/generic/containers/Button';
import { Col } from '@/components/generic/containers/Col';
import { Row } from '@/components/generic/containers/Row';
import { useDataCache } from '@/context/DataCacheProvider';
import { useNow } from '@/hooks/time/useNow';
import { conName } from '@/configuration';
import { EventDayDetails } from '@/store/eurofurence/types';

const ONE_HOUR = 60 * 60 * 1000;
const ONE_MINUTE = 60 * 1000;

export function TimeTravel() {
    const { t } = useTranslation("TimeTravel");
    const { getCacheSync, saveCache } = useDataCache();
    const now = useNow();
    const timeOffset = (getCacheSync("timetravel", "offset")?.data as unknown as number) ?? 0;
    const enabled = (getCacheSync("timetravel", "enabled")?.data as unknown as boolean) ?? false;
    const eventDays = (getCacheSync("eventDays", "all")?.data ?? []) as EventDayDetails[];

    // Calculate week before and after
    const weekBefore = useMemo(() => {
        if (!eventDays.length) return null;
        const firstDay = new Date(eventDays[0].Date);
        return subWeeks(firstDay, 1).toISOString();
    }, [eventDays]);

    const weekAfter = useMemo(() => {
        if (!eventDays.length) return null;
        const lastDay = new Date(eventDays[eventDays.length - 1].Date);
        return addWeeks(lastDay, 1).toISOString();
    }, [eventDays]);

    const handleEnableTimeTravel = (value: boolean) => {
        saveCache("timetravel", "enabled", value as unknown as number);
    };

    const handleResetTravel = () => {
        saveCache("timetravel", "offset", 0);
    };

    const handleTravel = (amount: number) => {
        saveCache("timetravel", "offset", timeOffset + amount);
    };

    const handleTravelToDate = (date: string) => {
        const targetDate = new Date(date);
        const currentDate = new Date();
        const offset = targetDate.getTime() - currentDate.getTime();
        saveCache("timetravel", "offset", offset);
    };

    return (
        <View testID="TimeTravel" className="p-4">
            <Section title={t("title")} icon="airplane" subtitle={t("subtitle")} />
            <Label mb={5}>{t("originalTime", { time: format(new Date(), "yyyy-MM-dd HH:mm:ss") })}</Label>
            <Label mb={5}>{t("currentTime", { time: format(now, "yyyy-MM-dd HH:mm:ss") })}</Label>
            <Label mb={5}>{t("difference", { diff: `${Math.round(timeOffset / 1000)} seconds` })}</Label>

            <Row style={styles.row}>
                <Button
                    containerStyle={styles.button}
                    outline={enabled}
                    onPress={() => handleEnableTimeTravel(!enabled)}
                >
                    {enabled ? t("disable") : t("enable")}
                </Button>
                <Button
                    containerStyle={styles.button}
                    onPress={handleResetTravel}
                >
                    {t("reset")}
                </Button>
            </Row>

            <Row style={styles.row}>
                <Button
                    containerStyle={styles.button}
                    icon="chevron-left"
                    onPress={() => handleTravel(-ONE_HOUR)}
                >
                    1h
                </Button>
                <Button
                    containerStyle={styles.button}
                    icon="chevron-left"
                    onPress={() => handleTravel(-ONE_MINUTE)}
                >
                    1m
                </Button>
                <Button
                    containerStyle={styles.button}
                    iconRight="chevron-right"
                    onPress={() => handleTravel(ONE_MINUTE)}
                >
                    1m
                </Button>
                <Button
                    containerStyle={styles.button}
                    iconRight="chevron-right"
                    onPress={() => handleTravel(ONE_HOUR)}
                >
                    1h
                </Button>
            </Row>

            <Col style={styles.row} type="stretch">
                {weekBefore && (
                    <Button
                        containerStyle={styles.button}
                        icon="calendar-arrow-left"
                        onPress={() => handleTravelToDate(weekBefore)}
                    >
                        {t("week_before", { conName })}
                    </Button>
                )}

                {eventDays.map((day: EventDayDetails) => (
                    <Button
                        key={day.Id}
                        containerStyle={styles.button}
                        icon="calendar-cursor"
                        onPress={() => handleTravelToDate(day.Date)}
                    >
                        {day.Name}
                    </Button>
                ))}

                {weekAfter && (
                    <Button
                        containerStyle={styles.button}
                        icon="calendar-arrow-right"
                        onPress={() => handleTravelToDate(weekAfter)}
                    >
                        {t("week_after", { conName })}
                    </Button>
                )}
            </Col>
        </View>
    );
}

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
