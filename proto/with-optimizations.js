const modes = require('../constants/modes');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function(context, mode) {
    const isProduction = mode === modes.production;
    const minimizerPlugins = [new TerserPlugin()];

    if (isProduction) {
        minimizerPlugins.push(new OptimizeCssAssetsPlugin({}))
    }

    context._optimization['minimize'] = mode === modes.production;
    context._optimization['minimizer'] = minimizerPlugins;

    return this;
};
