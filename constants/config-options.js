const modes = require('./modes');
const bundleTypes = require('./bundle-types');

module.exports = {
    root: __dirname,
    mode: modes.development,
    bundleType: bundleTypes.client,
    includePaths: undefined,
    excludePaths: /node_modules/,
};
