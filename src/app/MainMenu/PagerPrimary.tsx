import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../components/Containers/Button";
import { Col } from "../../components/Containers/Col";
import { Grid } from "../../components/Containers/Grid";
import { Tab } from "../../components/Containers/Tab";
import { useAppSelector } from "../../store";
import { PrivateMessageLinker } from "../PrivateMessages/PrivateMessageLinker";

/**
 * Props to the pager.
 */
export type PagerMenuProps = {
    onMessages?: () => void;
    onLogin?: () => void;
    onInfo?: () => void;
    onCatchEmAll?: () => void;
    onServices?: () => void;
    onMaps?: () => void;
    onAbout?: () => void;
    onSettings?: () => void;
};

export const PagerPrimary: FC<PagerMenuProps> = ({ onMessages, onLogin, onInfo, onCatchEmAll, onServices, onMaps, onAbout, onSettings }) => {
    const loggedIn = useAppSelector((state) => state.authorization.isLoggedIn);

    return (
        <Col type="stretch">
            {loggedIn ? (
                <PrivateMessageLinker onOpenMessages={onMessages} />
            ) : (
                <View style={{ padding: 30 }}>
                    <Text style={styles.marginBefore}>You are currently not logged in</Text>
                    <Button containerStyle={styles.marginBefore} icon="log-in" onPress={onLogin}>
                        Log-in now
                    </Button>
                </View>
            )}
            <Grid cols={3} style={{ alignSelf: "stretch" }}>
                <Tab icon="information-circle" text="Info articles" onPress={onInfo} />
                <Tab icon="paw" text="Catch-em-all" onPress={onCatchEmAll} />
                <Tab icon="book-outline" text="Services" onPress={onServices} />
                <Tab icon="map" text="Maps" onPress={onMaps} />
                <Tab icon="card-outline" text="About" onPress={onAbout} />
                <Tab icon="cog" text="Settings" onPress={onSettings} />
            </Grid>
        </Col>
    );
};

const styles = StyleSheet.create({
    marginAfter: {
        marginBottom: 16,
    },
    marginBefore: {
        marginTop: 16,
    },
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        marginLeft: 8,
    },
});
