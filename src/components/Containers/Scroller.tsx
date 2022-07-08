import { FC } from "react";
import { ScrollView } from "react-native-gesture-handler";

export const Scroller: FC = ({ limitWidth = true, children }) => (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 100, maxWidth: limitWidth ? 600 : undefined, alignSelf: "center" }}>{children}</ScrollView>
);
