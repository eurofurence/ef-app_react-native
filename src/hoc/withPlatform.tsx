import { Platform } from "react-native";

type OS = typeof Platform.OS;

export const withPlatform =
    <ComponentType,>(Component: React.ComponentType<ComponentType>, platforms: OS[]) =>
    (props: ComponentType) =>
        platforms.includes(Platform.OS) ? <Component {...props} /> : null;
