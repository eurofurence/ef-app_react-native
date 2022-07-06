import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "../../components/Containers/Button";
import { useAppSelector } from "../../store";

export interface PagerMenuProps {
    onMessages?: () => void;
    onLogin?: () => void;
    onInfo?: () => void;
    onCatchEmAll?: () => void;
    onServices?: () => void;
    onSettings?: () => void;
    onAbout?: () => void;
}
export const PagerPrimary: FC<PagerMenuProps> = ({ onMessages, onLogin, onInfo, onCatchEmAll, onServices, onSettings, onAbout }) => {
    const loggedIn = useAppSelector((state) => state.authorization.isLoggedIn);

    return (
        <View style={{ padding: 30 }}>
            {loggedIn ? (
                <>
                    <Text style={styles.marginAfter}>
                        You have <Text style={{ fontWeight: "bold" }}>12</Text> new messages
                    </Text>
                    <Button containerStyle={styles.marginAfter} icon="mail-outline" onPress={onMessages}>
                        Open messages
                    </Button>
                </>
            ) : (
                <>
                    <Text style={styles.marginAfter}>You are currently not logged in</Text>
                    <Button containerStyle={styles.marginAfter} icon="log-in" onPress={onLogin}>
                        Log-in now
                    </Button>
                </>
            )}

            <Text style={styles.marginAfter}>More locations</Text>
            <Button containerStyle={styles.marginAfter} icon="information-circle" onPress={onInfo}>
                Info articles
            </Button>
            <Button containerStyle={styles.marginAfter} icon="paw" onPress={onCatchEmAll}>
                Catch-em-all
            </Button>
            <Button containerStyle={styles.marginAfter} icon="book-outline" onPress={onServices}>
                Services
            </Button>

            <View style={[styles.marginBefore, styles.row]}>
                <Button containerStyle={styles.rowLeft} outline icon="cog" onPress={onSettings}>
                    Settings
                </Button>
                <Button containerStyle={styles.rowRight} outline icon="card-outline" onPress={onAbout}>
                    About
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    marginAfter: {
        marginBottom: 16,
    },
    marginBefore: {
        marginTop: 16,
    },
    row: {
        flexDirection: "row",
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
