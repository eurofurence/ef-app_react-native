import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNow } from "@/hooks/time/useNow";
import { useDealersSearchIndex } from "@/store/eurofurence/selectors/search";
import { useFuseIntegration } from "@/hooks/searching/useFuseIntegration";
import { useDealerGroups } from "@/components/dealers/Dealers.common";
import { DealersSectionedList } from "@/components/dealers/DealersSectionedList";
import { Badge } from "@/components/generic/containers/Badge";
import { Label } from "@/components/generic/atoms/Label";
import { Search } from "@/components/generic/atoms/Search";
import { useDataCache } from "@/context/DataCacheProvider";
import { useMemo } from "react";
import { chain } from "lodash";

export default function RegularScreen() {
  // General state.
  const { t } = useTranslation("Dealers");
  const { getAllCacheSync } = useDataCache();
  const now = useNow();

  // Search integration.
  const searchIndex = useDealersSearchIndex();
  const [filter, setFilter, results] = useFuseIntegration(searchIndex);

    const projected = useMemo(() =>
        chain(getAllCacheSync("dealers") || [])
            .map(item => item.data)
            .filter(item => !item.IsAfterDark)
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
            {t("dealers_in_regular")}
          </Label>
          <Search filter={filter} setFilter={setFilter} />
        </>
      }
    />
  );
}
