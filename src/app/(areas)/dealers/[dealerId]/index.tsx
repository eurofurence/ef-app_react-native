import React from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { appStyles } from "@/components/AppStyles";
import { DealerContent } from "@/components/dealers/DealerContent";
import { Floater, padFloater } from "@/components/generic/containers/Floater";
import { Header } from "@/components/generic/containers/Header";
import { useUpdateSinceNote } from "@/hooks/records/useUpdateSinceNote";
import { useLatchTrue } from "@/hooks/util/useLatchTrue";
import { useDataCache } from "@/context/DataCacheProvider";
import { platformShareIcon } from "@/components/generic/atoms/Icon";
import { shareDealer } from "@/components/dealers/Dealers.common";
import { useThemeBackground } from "@/hooks/themes/useThemeHooks";

export default function DealerItem() {
    const { t } = useTranslation("Dealer");
    const { dealerId } = useLocalSearchParams<{ dealerId: string }>();
    const { getCacheSync } = useDataCache();
    const dealer = getCacheSync("dealers", dealerId)?.data;
    const backgroundStyle = useThemeBackground("background");

    // Get update note. Latch so it's displayed even if reset in background.
    const updated = useUpdateSinceNote(dealer);
    const showUpdated = useLatchTrue(updated);

    return (
        <ScrollView 
            style={[StyleSheet.absoluteFill, backgroundStyle]} 
            stickyHeaderIndices={[0]} 
            stickyHeaderHiddenOnScroll
        >
            <Header secondaryIcon={platformShareIcon} secondaryPress={() => dealer && shareDealer(dealer)}>
                {dealer?.DisplayNameOrAttendeeNickname ?? t("viewing_dealer")}
            </Header>
            <Floater contentStyle={appStyles.trailer}>
                {!dealer ? null : <DealerContent dealer={dealer} parentPad={padFloater} updated={showUpdated} />}
            </Floater>
        </ScrollView>
    );
} 