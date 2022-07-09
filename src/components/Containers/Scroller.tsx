import { FC } from "react";
import { ScrollView } from "react-native-gesture-handler";

export type ScrollerProps = {
    limitWidth?: boolean;
};

export const Scroller: FC<ScrollerProps> = ({ limitWidth = true, children }) => (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 100, maxWidth: limitWidth ? 600 : undefined, alignSelf: "center" }}>{children}</ScrollView>
);
