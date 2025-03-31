import * as React from "react";
import { useDataCache } from "@/context/DataCacheProvider";
import { useTranslation } from "react-i18next";
import { DealersSectionedList } from "@/components/dealers/DealersSectionedList";
import { Badge } from "@/components/generic/containers/Badge";
import { Label } from "@/components/generic/atoms/Label";
import { conName } from "@/configuration";
import { Search } from "@/components/generic/atoms/Search";
import { useFuseIntegration } from "@/hooks/searching/useFuseIntegration";
import { useDealersSearchIndex } from "@/store/eurofurence/selectors/search";
import { useDealerGroups } from "@/components/dealers/Dealers.common";
import { useNow } from "@/hooks/time/useNow";
import { useMemo } from "react";
import { chain } from "lodash";

export default function AllScreen() {
    // General state.
    const { t } = useTranslation("Dealers");
    const { getAllCacheSync } = useDataCache();
    const now = useNow();

    // Search integration.
    const dealerIndex = useDealersSearchIndex();
    const [filter, setFilter, results] = useFuseIntegration(dealerIndex);

    const projected = useMemo(() =>
        chain(getAllCacheSync("dealers") || [])
            .map(item => item.data)
            .sortBy("DisplayNameOrAttendeeNickname")
            .value(), [getAllCacheSync]);
    const dealersGroups = useDealerGroups(t, now, results, projected);

    return (
        <DealersSectionedList
            dealersGroups={dealersGroups}
            leader={
                <>
                    <Badge unpad={0} badgeColor="lighten" textColor="text" textType="regular">
                        {t("section_notice")}
                    </Badge>
                    <Label type="lead" variant="middle" mt={30}>
                        {t("dealers_at_convention", { convention: conName })}
                    </Label>

                    <Search filter={filter} setFilter={setFilter} />
                </>
            }
        />
    );
}
