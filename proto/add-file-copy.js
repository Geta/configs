const modes = require('../constants/modes');
const bundleTypes = require('../constants/bundle-types');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = function(context, mode, bundleType, rules) {
    if (bundleType === bundleTypes.client) {
        const plugin = new CopyPlugin(rules);

        if (mode === modes.production) {
            context._productionPlugins.push(plugin);
        } else if (mode === modes.development) {
            context._developmentPlugins.push(plugin);
        }
    }
};
