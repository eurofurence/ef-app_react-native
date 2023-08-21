import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DealerSectionProps } from "./DealerSection";
import { DealersSectionedListGeneric } from "./DealersSectionedListGeneric";
import { DealersTabsScreenParamsList } from "./DealersTabsScreen";
import { IconNames } from "../../components/Atoms/Icon";
import { Label } from "../../components/Atoms/Label";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { conName } from "../../configuration";
import { useAppSelector } from "../../store";
import { dealersSelectors } from "../../store/eurofurence.selectors";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

/**
 * Params handled by the screen in route.
 */
export type DealersListAllScreenParams = object;

/**
 * The properties to the screen as a component.
 */
export type DealersListAllScreenProps =
    // Route carrying from dealers tabs screen at "All", own navigation via own parameter list.
    CompositeScreenProps<
        PagesScreenProps<DealersTabsScreenParamsList, "All">,
        PagesScreenProps<DealersTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const DealersListAllScreen: FC<DealersListAllScreenProps> = () => {
    const { t } = useTranslation("Dealers");

    // Get the day. Use it to resolve events to display.
    const dealers = useAppSelector(dealersSelectors.selectAll);
    const dealersGroups = useMemo(() => {
        return chain(dealers)
            .orderBy("FullName")
            .groupBy((dealer) => dealer.FullName.substring(0, 1).toUpperCase())
            .entries()
            .flatMap(([firstLetter, dealers]) => [
                {
                    title: firstLetter,
                    icon: "bookmark" as IconNames,
                } as DealerSectionProps,
                ...dealers,
            ])
            .value();
    }, [t, dealers]);

    const leader = useMemo(() => {
        return (
            <Label type="h1" variant="middle" mt={30}>
                {t("dealers_at_convention", { convention: conName })}
            </Label>
        );
    }, [t]);

    return <DealersSectionedListGeneric dealersGroups={dealersGroups} leader={leader} />;
};
