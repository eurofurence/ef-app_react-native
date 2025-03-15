import { useAuxiliary } from "@/store/auxiliary/slice";
import { RecordId } from "../eurofurence/types";

export const selectLastViewedUtc = (id: RecordId) => {
    const { state } = useAuxiliary();
    return state.lastViewTimesUtc?.[id] ?? null;
};

export const selectHiddenEventIds = () => {
    const { state } = useAuxiliary();
    return state.hiddenEvents ?? [];
};

export const selectFavoriteDealerIds = () => {
    const { state } = useAuxiliary();
    return state.favoriteDealers ?? [];
};
