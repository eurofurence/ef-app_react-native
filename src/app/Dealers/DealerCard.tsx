import moment from "moment";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useNow } from "../../hooks/useNow";
import { DealerWithDetails } from "../../store/eurofurence.selectors";
import { DealerCardContent } from "./DealerCardContent";

export type DealerCardProps = {
    dealer: DealerWithDetails;
    onPress?: () => void;
    onLongPress?: () => void;
};

export const DealerCard: FC<DealerCardProps> = ({ dealer, onPress, onLongPress }) => {
    const { t } = useTranslation("Dealer");
    const [now] = useNow();

    const avatar = useMemo(() => {
        if (dealer.ArtistThumbnailImageUrl) return { uri: dealer.ArtistThumbnailImageUrl };
        else if (dealer.ArtistImageUrl) return { uri: dealer.ArtistImageUrl };
        else return require("../../../assets/images/dealer_black.png");
    }, [dealer]);
    const present = useMemo(() => Boolean(dealer.AttendanceDays.find((day) => now.isSame(day.Date, "day"))), [dealer, now]);

    const days = useMemo(
        () =>
            dealer.AttendanceDays
                // Convert to medium representation.
                .map((day) => moment(day.Date).format("ddd"))
                // Join comma separatated.
                .join(", "),
        [dealer, t]
    );

    return <DealerCardContent avatar={avatar} name={dealer.FullName} present={present} merchandise={dealer.Merchandise} days={days} onPress={onPress} onLongPress={onLongPress} />;
};
