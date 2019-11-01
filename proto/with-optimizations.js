const modes = require('../constants/modes');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = function(context, mode) {
    if (mode === modes.production) {
        context._optimization['minimizer'] = [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
            }),
            new OptimizeCssAssetsPlugin({}),
        ];
    }
    return this;
};
