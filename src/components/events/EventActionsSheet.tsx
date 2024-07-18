import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { debounce } from "lodash";
import { FC, useEffect, useMemo, useRef } from "react";
import { Platform, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { EventContent } from "./EventContent";
import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { EventDetails } from "../../store/eurofurence/types";

type EventActionsSheetProps = {
    event: EventDetails | null;
    onClose?: () => void;
};

/**
 * Returns a normal scroll view on web for compatibility.
 */
const EventActionsSheetScrollView = Platform.OS === "web" ? ScrollView : BottomSheetScrollView;

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
            {/* TODO: Update note? */}
            <EventActionsSheetScrollView style={styles.content}>{!event ? null : <EventContent event={event} shareButton />}</EventActionsSheetScrollView>
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
