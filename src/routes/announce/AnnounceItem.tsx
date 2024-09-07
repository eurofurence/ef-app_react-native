import moment from "moment-timezone";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../../components/AppStyles";
import { Banner } from "../../components/generic/atoms/Banner";
import { Label } from "../../components/generic/atoms/Label";
import { MarkdownContent } from "../../components/generic/atoms/MarkdownContent";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { Row } from "../../components/generic/containers/Row";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { announcementsSelectors } from "../../store/eurofurence/selectors/records";

export type AnnounceItemParams = {
    id: string;
};

export const AnnounceItem = () => {
    const { t } = useTranslation("Announcement");
    const route = useAppRoute("AnnounceItem");
    const announcement = useAppSelector((state) => announcementsSelectors.selectById(state, route.params.id));
    // TODO: Maybe wait force fetch??
    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{t("header")}</Header>
            <Floater contentStyle={appStyles.trailer}>
                {!announcement ? null : (
                    <>
                        <Label type="h1" mt={30} mb={10}>
                            {announcement.NormalizedTitle}
                        </Label>
                        <Row style={styles.byline} variant="spaced">
                            <Label type="compact">{moment.utc(announcement.ValidFromDateTimeUtc).local().format("lll")}</Label>

                            <Label style={[styles.tag]} type="regular" ellipsizeMode="head" numberOfLines={1}>
                                {announcement.Area} - {announcement.Author}
                            </Label>
                        </Row>

                        {!announcement.Image ? null : (
                            <View style={styles.posterLine}>
                                <Banner image={announcement.Image} viewable />
                            </View>
                        )}

                        <MarkdownContent>{announcement.Content}</MarkdownContent>
                    </>
                )}
            </Floater>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    byline: {
        marginTop: 10,
        marginBottom: 30,
    },
    tag: {
        textAlign: "right",
    },
    posterLine: {
        marginBottom: 20,
        alignItems: "center",
    },
});
