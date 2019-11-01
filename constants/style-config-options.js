const assign = require('nested-object-assign');
const path = require('path');
const includeExclude = require('./include-exclude-options');

module.exports = assign({}, includeExclude, {
    postCssConfigPath: path.resolve(__dirname, '../configs'),
    styleLintConfigPath: path.resolve(__dirname, '../configs/stylelint.config.js'),
});
