import { useNavigation } from "@react-navigation/core";
import { FC } from "react";
import { match } from "ts-pattern";

import { useAppSelector } from "../../store";
import { dealersCompleteSelectors, dealersSelectors } from "../../store/eurofurence.selectors";
import { LinkFragment } from "../../store/eurofurence.types";
import { DealerCard } from "../Dealers/DealerCard";

type LinkItemProps = {
    link: LinkFragment & {
        id: string;
    };
};

const DealerLinkItem: FC<LinkItemProps> = ({ link }) => {
    const navigation = useNavigation();
    const dealer = useAppSelector((state) => dealersCompleteSelectors.selectById(state, link.Target));

    if (dealer === undefined) {
        return null;
    }

    return <DealerCard dealer={dealer} onPress={() => navigation.navigate("Dealer", { id: link.Target })} />;
};

export const LinkItem: FC<LinkItemProps> = ({ link }) => {
    return match(link.FragmentType)
        .with("DealerDetail", () => <DealerLinkItem link={link} />)
        .otherwise(() => null);
};
