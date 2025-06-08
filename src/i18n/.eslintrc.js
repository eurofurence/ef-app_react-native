module.exports = {
  // Start a new configuration root so the other rules are not applied to this
  // directory. Otherwise, there are a lot of parser errors.
  root: true,
  overrides: [
    {
      files: ['*.??.json'],
      extends: ['plugin:i18n-json/recommended'],
      rules: {
        'i18n-json/valid-message-syntax': 'off',
        // The relative path here is from the eslint I18N plugin and therefore
        // able to resolve the project root more stable than relative paths
        // from the current file (might break in some IDEs).
        'i18n-json/identical-keys': [1, { filePath: '../../../../src/i18n/translations.en.json' }],
      },
    },
  ],
}
