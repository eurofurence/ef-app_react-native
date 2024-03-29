import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { debounce } from "lodash";
import { FC, useEffect, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";

import { useThemeBackground } from "../../context/Theme";
import { EventDetails } from "../../store/eurofurence.types";
import { EventContent } from "./EventContent";

type EventActionsSheetProps = {
    event: EventDetails | null;
    onClose?: () => void;
};

export const EventActionsSheet: FC<EventActionsSheetProps> = ({ event, onClose }) => {
    const sheetRef = useRef<BottomSheet>(null);
    const styleBackground = useThemeBackground("background");
    const styleHandle = useThemeBackground("inverted");

    const close = useMemo(() => (onClose ? debounce(onClose, 100) : undefined), [onClose]);

    useEffect(() => {
        if (event) {
            sheetRef.current?.snapToIndex(0);
        } else {
            sheetRef.current?.close();
        }
    }, [sheetRef, event]);

    return (
        <BottomSheet
            backgroundStyle={styleBackground}
            handleStyle={styles.handle}
            handleIndicatorStyle={styleHandle}
            ref={sheetRef}
            snapPoints={["25%", "50%", "75%"]}
            index={-1}
            enablePanDownToClose
            onClose={close}
        >
            <BottomSheetScrollView style={styles.content}>{!event ? null : <EventContent event={event} />}</BottomSheetScrollView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    handle: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    content: {
        paddingHorizontal: 30,
        paddingBottom: 100,
    },
});
