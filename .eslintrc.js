// https://docs.expo.dev/guides/using-eslint/
// Next expo version fully supports flat config and eslint 9.
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  ignorePatterns: ['/dist/*'],
  rules: {
    'prettier/prettier': 'error',
  },
}
