import moment from "moment";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useNow } from "../../hooks/useNow";
import { DealerDetails } from "../../store/eurofurence.types";
import { DealerCardContent } from "./DealerCardContent";

export type DealerCardProps = {
    dealer: DealerDetails;
    onPress?: () => void;
    onLongPress?: () => void;
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
            !dealer.AttendsOnThursday && moment().day(4).format("dddd"),
            !dealer.AttendsOnFriday && moment().day(5).format("dddd"),
            !dealer.AttendsOnSaturday && moment().day(6).format("dddd"),
        ]
            .filter(Boolean)
            .join(", ");
    }, [dealer, t]);

    return (
        <DealerCardContent
            avatar={avatar}
            name={dealer.FullName}
            present={present}
            merchandise={dealer.Merchandise}
            offDays={offDays}
            onPress={onPress}
            onLongPress={onLongPress}
        />
    );
};
