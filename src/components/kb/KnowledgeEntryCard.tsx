import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { KnowledgeEntryRecord } from "../../store/eurofurence.types";
import { Label } from "../generic/atoms/Label";
import { Card } from "../generic/containers/Card";

export const KnowledgeEntryCard: FC<{ entry: KnowledgeEntryRecord }> = ({ entry }) => {
    const navigation = useAppNavigation("KnowledgeGroups");

    return (
        <View style={styles.padding}>
            <Card style={styles.card} onPress={() => navigation.navigate("KnowledgeEntry", { id: entry.Id })}>
                <Label>{entry.Title}</Label>
            </Card>
        </View>
    );
};
const styles = StyleSheet.create({
    padding: { paddingHorizontal: 20 },
    card: {
        minHeight: 0,
        marginVertical: 4,
    },
});
