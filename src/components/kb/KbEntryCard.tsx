import React, { FC } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { KnowledgeEntryRecord } from "../../store/eurofurence.types";
import { appStyles } from "../AppStyles";
import { Label } from "../generic/atoms/Label";
import { Card } from "../generic/containers/Card";

export type KbEntryCardProps = {
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    onPress: (entry: KnowledgeEntryRecord) => void;
    entry: KnowledgeEntryRecord;
};
// /**
//  * Creates the event instance props for an upcoming or running event.
//  * @param details The details to use.
//  * @param now The moment to check against.
//  */
// export function eventInstanceForAny(details: EventDetails, now: Moment) {
//     return { details, happening: now.isBetween(details.StartDateTimeUtc, details.EndDateTimeUtc), done: now.isAfter(details.EndDateTimeUtc) };
// }
export const KbEntryCard: FC<KbEntryCardProps> = ({ containerStyle, style, entry, onPress }) => {
    return (
        <Card containerStyle={containerStyle} style={[styles.container, appStyles.shadow, style]} onPress={() => onPress(entry)}>
            <Label>{entry.Title}</Label>
        </Card>
    );
};
const styles = StyleSheet.create({
    container: {
        minHeight: 40,
        marginVertical: 8,
    },
});
