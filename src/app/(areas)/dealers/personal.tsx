import * as React from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/generic/atoms/Label";
import { useFavoritesState } from "@/hooks/favorites/useFavoritesState";
import { useDealerLocationGroups } from "@/components/dealers/Dealers.common";
import { useNow } from "@/hooks/time/useNow";
import { DealersSectionedList } from "@/components/dealers/DealersSectionedList";
import { useMemo } from "react";

export default function PersonalScreen() {
  // General state.
  const { t } = useTranslation("Dealers");
  const now = useNow();

  const { favoriteDealers } = useFavoritesState();
  const projected = useMemo(() =>
    Array.from(favoriteDealers)
      .sort((a, b) => a.DisplayNameOrAttendeeNickname.localeCompare(b.DisplayNameOrAttendeeNickname)), [favoriteDealers]);
  const dealersGroups = useDealerLocationGroups(t, now, null, projected);
  return (
    <DealersSectionedList
      dealersGroups={dealersGroups}
      leader={
        // TODO: Add avatar back.
        <Label type="lead" variant="middle" mt={30}>
          {t("favorites_title")}
        </Label>
      }
      empty={
        <Label type="para" mt={20} ml={20} mr={20} variant="middle">
          {t("favorites_empty")}
        </Label>
      }
    />
  );
}
