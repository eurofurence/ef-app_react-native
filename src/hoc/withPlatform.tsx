import { ComponentType } from "react";
import { Platform } from "react-native";

type OS = typeof Platform.OS;

// Constraint to object asserts that we are not trying to create an intrinsic element, but a functional component
// or a class component.

/**
 * Returns a component that only renders on the given platforms.
 * @param Component The component that should be conditionally wrapped.
 * @param platforms Array of valid platforms, null will be rendered otherwise.
 */
export function withPlatform<TComponent extends object>(Component: ComponentType<TComponent>, platforms: OS[]) {
    // Create new component on platforms only. Copy display name.
    const PlatformComponent = (props: TComponent) => (platforms.includes(Platform.OS) ? <Component {...props} /> : null);
    PlatformComponent.displayName = Component.displayName;
    return PlatformComponent;
}
