import { FC } from "react";
import { Linking } from "react-native";
import { match } from "ts-pattern";

import { Button } from "../../components/Containers/Button";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { dealersCompleteSelectors } from "../../store/eurofurence.selectors";
import { LinkFragment } from "../../store/eurofurence.types";
import { DealerCard } from "../Dealers/DealerCard";

type LinkItemProps = {
    link: LinkFragment;
};

const DealerLinkItem: FC<LinkItemProps> = ({ link }) => {
    const navigation = useAppNavigation("Areas");
    const dealer = useAppSelector((state) => dealersCompleteSelectors.selectById(state, link.Target));

    if (dealer === undefined) {
        return null;
    }

    return <DealerCard dealer={dealer} onPress={() => navigation.navigate("Dealer", { id: link.Target })} />;
};

const WebExternalLinkItem: FC<LinkItemProps> = ({ link }) => {
    return (
        <Button style={{ marginVertical: 5 }} onPress={() => Linking.openURL(link.Target)}>
            {link.Name}
        </Button>
    );
};

const MapEntryLinkItem: FC<LinkItemProps> = ({ link }) => {
    const navigation = useAppNavigation("Areas");
    return (
        <Button style={{ marginVertical: 5 }} onPress={() => navigation.navigate("Map", { id: link.Target })}>
            {link.Name}
        </Button>
    );
};

export const LinkItem: FC<LinkItemProps> = ({ link }) => {
    return match(link.FragmentType)
        .with("DealerDetail", () => <DealerLinkItem link={link} />)
        .with("WebExternal", () => <WebExternalLinkItem link={link} />)
        .with("MapEntry", () => <MapEntryLinkItem link={link} />)
        .otherwise(() => null);
};
