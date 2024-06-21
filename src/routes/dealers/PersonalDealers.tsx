import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { Image } from "expo-image";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { useDealerLocationGroups } from "./Dealers.common";
import { DealersRouterParamsList } from "./DealersRouter";
import { DealersSectionedList } from "../../components/dealers/DealersSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { padFloater } from "../../components/generic/containers/Floater";
import { Row } from "../../components/generic/containers/Row";
import { useAuthContext } from "../../context/AuthContext";
import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { selectFavoriteDealers } from "../../store/eurofurence/selectors/dealers";
import { assetSource } from "../../util/assets";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type PersonalDealersParams = object;

/**
 * The properties to the screen as a component.
 */
export type PersonalDealersProps =
    // Route carrying from dealers tabs screen at any of the day names, own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<DealersRouterParamsList, "Personal">,
        MaterialTopTabScreenProps<DealersRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const PersonalDealers: FC<PersonalDealersProps> = ({ navigation }) => {
    // General state.
    const { t } = useTranslation("Dealers");
    const now = useNow();
    const { user } = useAuthContext();
    const avatarBackground = useThemeBackground("primary");

    const dealersAll = useAppSelector(selectFavoriteDealers);
    const dealersGroups = useDealerLocationGroups(t, now, null, dealersAll);
    return (
        <DealersSectionedList
            navigation={navigation}
            dealersGroups={dealersGroups}
            leader={
                <Row type="center" variant="center" style={styles.marginTop}>
                    <Image
                        style={[avatarBackground, styles.avatarCircle]}
                        source={user?.avatar ?? assetSource("ych")}
                        contentFit="contain"
                        placeholder="ych"
                        transition={60}
                        priority="low"
                    />
                    <Label ml={16} type="lead" variant="middle">
                        {t("favorites_title")}
                    </Label>
                </Row>
            }
            empty={
                <Label type="para" variant="middle" style={[styles.marginTop, styles.padding]}>
                    {t("favorites_empty")}
                </Label>
            }
        />
    );
};

const styles = StyleSheet.create({
    marginTop: {
        marginTop: 30,
    },
    padding: {
        paddingHorizontal: padFloater,
    },
    avatarCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
});
