const modes = require('../constants/modes');
const TsCheckerPlugin = require('fork-ts-checker-webpack-plugin');
const TsCheckerNotifierPlugin = require('fork-ts-checker-notifier-webpack-plugin');

function getTsCheckerOptions(mode) {
    if (mode === modes.development) {
        return {
            eslint: true,
            memoryLimit: 4096,
        };
    }

    return {
        async: false,
        useTypescriptIncrementalApi: true,
        memoryLimit: 4096,
    };
}

module.exports = function(context, mode) {
    const tsCheckerPlugin = new TsCheckerPlugin(getTsCheckerOptions(mode));
    const tsCheckerNotifierPlugin = new TsCheckerNotifierPlugin({
        title: 'TypeScript',
        excludeWarnings: false,
    });
    const tsLoaderRule = {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
            transpileOnly: true,
        },
    };

    context._resolve.extensions.push('.tsx');
    context._resolve.extensions.push('.ts');

    if (context._resolve.extensions.indexOf('.js') === -1) {
        context._resolve.extensions.push('.js');
    }

    if (mode === modes.production) {
        context._productionPlugins.push(tsCheckerPlugin);
        context._productionRules.push(tsLoaderRule);
    } else if (mode === modes.development) {
        context._developmentPlugins.push(tsCheckerNotifierPlugin);
        context._developmentPlugins.push(tsCheckerPlugin);
        context._developmentRules.push(tsLoaderRule);
    }
};
