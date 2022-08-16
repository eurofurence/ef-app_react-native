import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FC, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

import { EventDetails } from "../../store/eurofurence.types";
import { EventContent } from "./EventContent";

type EventActionsSheetProps = {
    eventRecord: EventDetails | undefined;
    onClose?: () => void;
};

export const EventActionsSheet: FC<EventActionsSheetProps> = ({ eventRecord, onClose }) => {
    const sheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        if (eventRecord) {
            sheetRef.current?.snapToIndex(0);
        } else {
            sheetRef.current?.close();
        }
    }, [eventRecord]);

    if (eventRecord === undefined) {
        return null;
    }

    return (
        <BottomSheet snapPoints={["25%", "50%", "75%"]} index={-1} enablePanDownToClose ref={sheetRef} onClose={onClose}>
            <BottomSheetScrollView style={styles.container}>{eventRecord && <EventContent event={eventRecord} />}</BottomSheetScrollView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingBottom: 100,
    },
});
