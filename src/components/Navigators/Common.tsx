import { TabActions } from "@react-navigation/core";

export const navigateTab = (navigation, target) => {
    const state = navigation.getState();
    if (typeof target === "number") target = state.routes[target];

    const event = navigation.emit({
        type: "tabPress",
        target: target.key,
        canPreventDefault: true,
    });

    if (!event.defaultPrevented) {
        navigation.dispatch({
            ...TabActions.jumpTo(target.name),
            target: state.key,
        });
    }
};
