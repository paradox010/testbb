const fabric = require('@umijs/fabric');
const { getStylelintConfig } = require('@iceworks/spec');

module.exports = getStylelintConfig('rax', {
  customSyntax: 'postcss-less',
  extends: ['stylelint-config-recommended-less'],
  rules: {
    'at-rule-no-unknown': null,
    // 'less/color-no-invalid-hex': true,
    // 'less/no-duplicate-variables': true,
    // 'function-calc-no-invalid': null,
    'selector-pseudo-class-no-unknown': null,
    'length-zero-no-unit': null,
  },
});
