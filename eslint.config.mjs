// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { fixupPluginRules } from "@eslint/compat";
import ImportRules from "eslint-plugin-import";
import i18nJson from "eslint-plugin-i18n-json";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        // Override for some typescript we actually kinda like
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        files: ["**/i18n/translations.*.json"],
        plugins: {
            "i18n-json": i18nJson,
        },
        rules: {
            ...i18nJson.configs.recommended.rules,
            "i18n-json/valid-message-syntax": "off",
            "i18n-json/identical-keys": [
                1,
                {
                    filePath: "../../../../src/i18n/translations.en.json",
                },
            ],
            "@typescript-eslint/no-unused-expressions": "off",
        },
    },
    {
        // Override for config js files
        files: ["**/*.config.js"],
        extends: [tseslint.configs.disableTypeChecked],
        rules: {
            "no-undef": "off",
            "@typescript-eslint/no-require-imports": "off",
        },
    },
    {
        // Override for testing related stuff
        files: ["**/setupTests.js"],
        extends: [tseslint.configs.disableTypeChecked],
        rules: {
            "no-undef": "off",
        },
    },
    {
        // Handle react
        files: ["**/*.tsx", "**/*.jsx"],
        plugins: {
            react: react,
            "react-hooks": fixupPluginRules(reactHooks),
        },
        settings: {
            react: {
                version: "18",
            },
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off",
            "react/display-name": "off",
        },
    },
    {
        // Enforce importing rules
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        plugins: {
            import: fixupPluginRules(ImportRules),
        },
        settings: {
            "import/resolver": {
                typescript: true, // Make sure TypeScript resolver is set up for imports
            },
        },
        rules: {
            ...ImportRules.configs.recommended.rules,
            "import/default": "warn",
            "import/no-unresolved": "off",
            "import/namespace": "warn",
            "import/imports-first": "warn",
            "import/order": "warn",
        },
    },
    {
        // Add support for parsing date-fns and related modules
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        parserOptions: {
            ecmaVersion: 2020, // Ensure ECMAScript 2020 for module imports
            sourceType: "module", // Enable ES module syntax
        },
        rules: {
            // Additional rule overrides for date-fns handling
            "import/no-unresolved": "off", // Ignore unresolved for modules like date-fns-tz
        },
    },
);
