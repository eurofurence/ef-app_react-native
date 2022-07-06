import { Easing } from "react-native-reanimated";

export const quickCubicIn = Object.freeze({
    duration: 234,
    easing: Easing.in(Easing.cubic),
});

export const quickCubicOut = Object.freeze({
    duration: 234,
    easing: Easing.out(Easing.cubic),
});
