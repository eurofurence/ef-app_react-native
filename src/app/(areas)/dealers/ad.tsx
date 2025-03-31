import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { chain } from "lodash";
import { useNow } from "@/hooks/time/useNow";
import { useDealersSearchIndex } from "@/store/eurofurence/selectors/search";
import { useFuseIntegration } from "@/hooks/searching/useFuseIntegration";
import { useDealerGroups } from "@/components/dealers/Dealers.common";
import { DealersSectionedList } from "@/components/dealers/DealersSectionedList";
import { Badge } from "@/components/generic/containers/Badge";
import { Label } from "@/components/generic/atoms/Label";
import { Search } from "@/components/generic/atoms/Search";
import { useDataCache } from "@/context/DataCacheProvider";

export default function AfterDarkScreen() {
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
      .filter(item => Boolean(item.IsAfterDark))
      .sortBy("DisplayNameOrAttendeeNickname")
      .value(), [getAllCacheSync]);
  const groups = useDealerGroups(t, now, results, projected);

  return (
    <DealersSectionedList
      dealersGroups={groups}
      leader={
        <>
          <Badge unpad={0} badgeColor="lighten" textColor="text" textType="regular">
            {t("section_notice")}
          </Badge>
          <Label type="lead" variant="middle" mt={30}>
            {t("dealers_in_ad")}
          </Label>
          <Search filter={filter} setFilter={setFilter} />
        </>
      }
    />
  );
}
