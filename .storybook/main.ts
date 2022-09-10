import { mergeConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";

module.exports = {
    "stories": [
        "../src/**/*.stories.mdx",
        "../src/**/*.stories.@(js|jsx|ts|tsx)"
    ],
    "addons": [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        "@storybook/addon-react-native-web"
    ],
    "framework": "@storybook/react"
};
