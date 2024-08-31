import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { ArtistAlleyForm } from "../../components/artistalley/ArtistAlleyForm";
import { Floater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";

export type ArtistAlleyRegParams = object;

export const ArtistAlleyReg = () => {
    const { t } = useTranslation("ArtistAlley");

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]}>
            <Header>{t("title")}</Header>
            <Floater containerStyle={styles.margin}>
                <ArtistAlleyForm />
            </Floater>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    margin: {
        marginTop: 10,
    },
});
