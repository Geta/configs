const modes = require('../constants/modes');
const bundleTypes = require('../constants/bundle-types');
const CdnPlugin = require('webpack-cdn-plugin');

module.exports = function(context, mode, bundleType, modules) {
    if (bundleType === bundleTypes.client) {
        const plugin = new CdnPlugin({
            modules: modules,
            prod: mode === modes.production,
            publicPath: '/node_modules',
        });

        if (mode === modes.production) {
            context._productionPlugins.push(plugin);
        } else if (mode === modes.development) {
            context._developmentPlugins.push(plugin);
        }
    }
};
