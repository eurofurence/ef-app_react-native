import { FC, useCallback } from "react";
import { Linking, StyleSheet } from "react-native";
import { match } from "ts-pattern";

import { Button } from "../../components/Containers/Button";
import { useAppNavigation } from "../../hooks/navigation/useAppNavigation";
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

    const onPress = useCallback(() => navigation.navigate("Dealer", { id: link.Target }), [navigation, link]);

    if (dealer === undefined) {
        return null;
    }

    return <DealerCard dealer={dealer} onPress={onPress} />;
};

const WebExternalLinkItem: FC<LinkItemProps> = ({ link }) => {
    const onPress = useCallback(() => {
        Linking.openURL(link.Target).catch();
    }, [link]);

    return (
        <Button style={styles.linkButton} onPress={onPress} icon={"web"}>
            {link.Name ? link.Name : link.Target}
        </Button>
    );
};

const MapEntryLinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
    const navigation = useAppNavigation("Areas");
    const onPress = useCallback(() => {
        if (map && entry) navigation.navigate("Map", { id: map.Id, entryId: entry.Id, linkId: entry?.Links.indexOf(link) });
    }, [navigation, map, entry, link]);

    return !map || !entry ? null : (
        <Button style={styles.linkButton} onPress={onPress}>
            {link.Name}
        </Button>
    );
};

const EventConferenceRoomLinkItem: FC<LinkItemProps> = ({ map, entry, link }) => {
    const navigation = useAppNavigation("Areas");
    const onPress = useCallback(() => {
        if (map && entry) navigation.navigate("Map", { id: map.Id, entryId: entry.Id, linkId: entry?.Links.indexOf(link) });
    }, [navigation, map, entry, link]);

    return !map || !entry ? null : (
        <Button style={styles.linkButton} onPress={onPress}>
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

const styles = StyleSheet.create({
    linkButton: {
        marginVertical: 5,
    },
});
