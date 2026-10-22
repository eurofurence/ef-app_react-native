import type {StorybookConfig} from '@storybook/react-native-web-vite';
import {loadEnvFile} from 'node:process';

loadEnvFile('.env');

const config: StorybookConfig = {
  framework: '@storybook/react-native-web-vite',
  stories: ['../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-onboarding'],
  staticDirs: ['../src/stories/assets'],
  viteFinal(config) {
    config.define = {}
    for (const key in process.env)
      if (key.startsWith('EXPO_PUBLIC_'))
        config.define[`process.env.${key}`] = JSON.stringify(process.env[key] || '');
    return config
  },
};

export default config;
