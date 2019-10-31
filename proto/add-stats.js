const modes = require('../constants/modes');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');

module.exports = function(context, mode) {
    const plugin = new BundleAnalyzerPlugin();

    if (mode === modes.production) {
        context._productionPlugins.push(plugin);
    } else if (mode === modes.development) {
        context._developmentPlugins.push(plugin);
    }
};
