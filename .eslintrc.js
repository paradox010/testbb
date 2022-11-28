const { getESLintConfig } = require('@iceworks/spec');

// https://www.npmjs.com/package/@iceworks/spec
module.exports = getESLintConfig('react-ts', {
  rules: {
    '@iceworks/best-practices/no-http-url': 'off',
    '@iceworks/best-practices/no-js-in-ts-project': 'warn',
    'no-console': 'off',
  },
});
