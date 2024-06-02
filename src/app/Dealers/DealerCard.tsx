import moment from "moment";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { DealerCardContent } from "./DealerCardContent";
import { useNow } from "../../hooks/time/useNow";
import { DealerDetails } from "../../store/eurofurence.types";

export type DealerCardProps = {
    dealer: DealerDetails;
    onPress?: (dealer: DealerDetails) => void;
    onLongPress?: (dealer: DealerDetails) => void;
};

export const DealerCard: FC<DealerCardProps> = ({ dealer, onPress, onLongPress }) => {
    const { t } = useTranslation("Dealer");
    const [now] = useNow();

    const avatar = useMemo(() => {
        if (dealer.ArtistThumbnail) return { uri: dealer.ArtistThumbnail.FullUrl };
        else if (dealer.Artist) return { uri: dealer.Artist.FullUrl };
        else return require("../../../assets/images/dealer_black.png");
    }, [dealer]);
    const present = useMemo(() => Boolean(dealer.AttendanceDays.find((day) => now.isSame(day.Date, "day"))), [dealer, now]);

    const offDays = useMemo(() => {
        return [
            !dealer.AttendsOnThursday && moment().day(1).format("dddd"),
            !dealer.AttendsOnFriday && moment().day(2).format("dddd"),
            !dealer.AttendsOnSaturday && moment().day(3).format("dddd"),
        ]
            .filter(Boolean)
            .join(", ");
    }, [dealer, t]);

    // Wrap delegates.
    const onPressDelegate = useCallback(() => onPress?.(dealer), [onPress, dealer]);
    const onLongPressDelegate = useCallback(() => onLongPress?.(dealer), [onLongPress, dealer]);

    return (
        <DealerCardContent
            avatar={avatar}
            name={dealer.FullName}
            present={present}
            categories={dealer.Categories}
            offDays={offDays}
            onPress={onPressDelegate}
            onLongPress={onLongPressDelegate}
        />
    );
};
