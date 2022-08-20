import { FC } from "react";
import { Linking } from "react-native";
import { match } from "ts-pattern";

import { Button } from "../../components/Containers/Button";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { dealersSelectors } from "../../store/eurofurence.selectors";
import { LinkFragment, MapDetails, MapEntryDetails } from "../../store/eurofurence.types";
import { DealerCard } from "../Dealers/DealerCard";

type LinkItemProps = {
    map?: MapDetails;
    entry?: MapEntryDetails;
    link: LinkFragment;
};

const DealerLinkItem: FC<LinkItemProps> = ({ link }) => {
    const navigation = useAppNavigation("Areas");
    const dealer = useAppSelector((state) => dealersSelectors.selectById(state, link.Target));

    if (dealer === undefined) {
        return null;
    }

    return <DealerCard dealer={dealer} onPress={() => navigation.navigate("Dealer", { id: link.Target })} />;
};

const WebExternalLinkItem: FC<LinkItemProps> = ({ link }) => {
    return (
        <Button onPress={() => Linking.openURL(link.Target)} icon={"web"}>
            {link.Name ? link.Name : link.Target}
        </Button>
    );
};

const MapEntryLinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
    const navigation = useAppNavigation("Areas");
    return !map || !entry ? null : (
        <Button style={{ marginVertical: 5 }} onPress={() => navigation.navigate("Map", { id: map.Id, entryId: entry.Id, linkId: entry?.Links.indexOf(link) })}>
            {link.Name}
        </Button>
    );
};

const EventConferenceRoomLinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
    const navigation = useAppNavigation("Areas");
    return !map || !entry ? null : (
        <Button style={{ marginVertical: 5 }} onPress={() => navigation.navigate("Map", { id: map.Id, entryId: entry.Id, linkId: entry?.Links.indexOf(link) })}>
            {link.Name}
        </Button>
    );
};

export const LinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
    return match(link.FragmentType)
        .with("DealerDetail", () => <DealerLinkItem map={map} entry={entry} link={link} />)
        .with("WebExternal", () => <WebExternalLinkItem map={map} entry={entry} link={link} />)
        .with("MapEntry", () => <MapEntryLinkItem map={map} entry={entry} link={link} />)
        .with("EventConferenceRoom", () => <EventConferenceRoomLinkItem map={map} entry={entry} link={link} />)
        .otherwise(() => null);
};
