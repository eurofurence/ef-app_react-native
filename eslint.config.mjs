import { defineConfig } from 'eslint/config'
// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  {
    ignores: ['dist/*', '.expo', '**/node_modules'],
  },
  ...compat.extends('expo', 'prettier'),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      prettier,
      import: importPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      // Import sorting rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object', 'type'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // Disable for React Native
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['app.config.js', 'src/configuration.tsx', 'src/init/firebaseApp.web.ts'],
    linterOptions: {
      reportUnusedDisableDirectives: 'off',
    },
  },
  {
    files: ['*.config.js', '*.config.mjs', 'webpack.config.js', 'tailwind.config.js', 'metro.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  ...storybook.configs['flat/recommended'],
])
