import * as React from "react";
import { useTranslation } from "react-i18next";
import { useNow } from "@/hooks/time/useNow";
import { useDealersSearchIndex } from "@/store/eurofurence/selectors/search";
import { useFuseIntegration } from "@/hooks/searching/useFuseIntegration";
import { useDealerAlphabeticalGroups } from "@/components/dealers/Dealers.common";
import { DealersSectionedList } from "@/components/dealers/DealersSectionedList";
import { Label } from "@/components/generic/atoms/Label";
import { conName } from "@/configuration";
import { Search } from "@/components/generic/atoms/Search";
import { useDataCache } from "@/context/DataCacheProvider";
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
  const dealersGroups = useDealerAlphabeticalGroups(t, now, results, projected);

  return (
    <DealersSectionedList
      dealersGroups={dealersGroups}
      leader={
        <>
          <Label type="lead" variant="middle" mt={30}>
            {t("dealers_at_convention", { convention: conName })}
          </Label>
          <Search filter={filter} setFilter={setFilter} />
        </>
      }
    />
  );
}
