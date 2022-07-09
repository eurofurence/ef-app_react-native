import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Scroller } from "../../components/Containers/Scroller";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { LoadingIndicator } from "../../components/Utilities/LoadingIndicator";
import { useSignalLoading } from "../../context/LoadingContext";
import { TimeTravel } from "../../components/Utilities/TimeTravel";
import { useTheme } from "../../context/Theme";
import { useAppDispatch, useAppSelector } from "../../store";
import { logout } from "../../store/authorization.slice";
import { annoucenementsSelectors, dealersSelectors, eventsSelector } from "../../store/eurofurence.selectors";
import { ScreenAreasNavigatorParamsList } from "../ScreenAreas";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";

/**
 * Params handled by the screen in route, nothing so far.
 */
export type ScreenHomeParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type ScreenHomeProps = CompositeScreenProps<TabScreenProps<ScreenAreasNavigatorParamsList, "Home">, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const ScreenHome: FC<ScreenHomeProps> = () => {
    // The content of this screen so far is more of a sandbox, nothing fixed.
    const { t } = useTranslation("Home");
    const dispatch = useAppDispatch();

    const announcements = useAppSelector(annoucenementsSelectors.selectAll);

    const theme = useTheme();

    const events = useAppSelector(eventsSelector.selectAll);
    const event = useAppSelector((state) => eventsSelector.selectById(state, "76430fe0-ece7-48c9-b8e6-fdbc3974ff64"));
    const eventsInRoom = useAppSelector((state) => eventsSelector.selectByDay(state, "7f69f120-3c8a-49bf-895a-20c2adade161"));
    const dealers = useAppSelector(dealersSelectors.selectAll);

    useSignalLoading(announcements.isFetching || events.isFetching || event.isFetching || dealers.isFetching);

    return (
        <Scroller>
            <Section icon="alarm" title="Countdown">
                {/* <Progress progress={countdown.percentage} color={colors.primary} style={{ marginTop: 20, marginBottom: 5 }} /> */}
            </Section>
            <Label mb={15}>{t("announcementsTitle", { count: announcements.length })}</Label>
            <Label mb={15}>{t("eventsTitle", { count: events.length })}</Label>
            <Label mb={15}>We have retrieved event {event?.Title ?? "..."}</Label>
            <Label mb={15}>There are {eventsInRoom.length} events in 2d5d9a98-aaca-4434-959d-99d20e675d3a</Label>
            <Label mb={15}>We have {dealers.length ?? "..."} dealers</Label>
            <Button onPress={() => dispatch(logout())}>Log-out</Button>
            <TimeTravel />
            {/* Theme verifier. */}
            <View style={{ marginTop: 30, flexDirection: "row", flexWrap: "wrap" }}>
                {Object.entries(theme).map(([name, color]) => (
                    <Text key={name} style={{ width: 150, height: 50, backgroundColor: color, padding: 15 }}>
                        {name}
                    </Text>
                ))}
            </View>
            {/* Label style verifier. */}
            <View style={{ backgroundColor: theme.background, alignSelf: "stretch", padding: 30 }}>
                <Label type="h1">Heading 1</Label>
                <Label type="h2">Heading 2</Label>
                <Label type="h3">Heading 3</Label>
                <Label type="h4">Heading 4</Label>
                <Label type="regular">Regular</Label>
                <Label type="regular" color="important">
                    Important regular
                </Label>
            </View>
        </Scroller>
    );
};
