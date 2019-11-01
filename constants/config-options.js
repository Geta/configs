const modes = require('./modes');
const bundleTypes = require('./bundle-types');
const includeExclude = require('./include-exclude-options');
const assign = require('nested-object-assign');

module.exports = assign({}, includeExclude, {
    root: __dirname,
    mode: modes.development,
    bundleType: bundleTypes.client,
});
