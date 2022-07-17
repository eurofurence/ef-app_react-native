import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EnrichedDealerRecord } from "../../store/eurofurence.types";
import { DealerCardContent } from "./DealerCardContent";

export type DealerCardProps = {
    dealer: EnrichedDealerRecord;
    onPress?: () => void;
    onLongPress?: () => void;
};

export const DealerCard: FC<DealerCardProps> = ({ dealer, onPress, onLongPress }) => {
    const { t } = useTranslation("Dealer");

    const avatar = useMemo(() => {
        if (dealer.ArtistThumbnailImageUrl) return { uri: dealer.ArtistThumbnailImageUrl };
        else if (dealer.ArtistImageUrl) return { uri: dealer.ArtistImageUrl };
        else return require("../../../assets/images/dealer_black.png");
    }, [dealer]);

    const preview = useMemo(() => (dealer.ArtPreviewImageUrl ? { uri: dealer.ArtPreviewImageUrl } : undefined), [dealer]);

    const dealerDays = useMemo(() => {
        const result = [];
        if (dealer.AttendsOnThursday) result.push(t("attends_thu"));
        if (dealer.AttendsOnFriday) result.push(t("attends_fri"));
        if (dealer.AttendsOnSaturday) result.push(t("attends_sat"));
        return result.join(", ");
    }, [dealer, t]);

    return (
        <DealerCardContent
            avatar={avatar}
            preview={preview}
            name={dealer.FullName}
            merchandise={dealer.Merchandise}
            days={dealerDays}
            onPress={onPress}
            onLongPress={onLongPress}
        />
    );
};
