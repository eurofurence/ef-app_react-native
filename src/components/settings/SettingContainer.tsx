import { FC, PropsWithChildren } from "react";
import { View } from "react-native";

/**
 * Provides vertical spacing via margin around the children.
 * @param children Content components.
 * @constructor
 */
export const SettingContainer: FC<PropsWithChildren> = ({ children }) => <View style={{ marginVertical: 10 }}>{children}</View>;
