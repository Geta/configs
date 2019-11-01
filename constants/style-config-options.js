const path = require('path');

module.exports = {
    postCssConfigPath: path.resolve(__dirname, '../configs'),
    styleLintConfigPath: path.resolve(__dirname, '../configs/stylelint.config.js'),
    include: null,
    exclude: /node_modules/,
};
