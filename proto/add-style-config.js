const modes = require('../constants/modes');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = function(
    context,
    mode,
    postCssConfigPath,
    styleLintConfigPath = path.resolve(__dirname, '../configs/stylelint.config.js')
) {
    const miniCssExtractPlugin = new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFileName: '[id].css',
        ignoreOrder: false,
    });

    const rule = {
        test: /\.s?css$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    hmr: mode === modes.development,
                },
            },
            {
                loader: 'css-loader',
            },
            {
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: postCssConfigPath,
                    },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    implementation: require('node-sass'),
                    sourceMap: mode === modes.development,
                },
            },
        ],
    };

    context._resolve.extensions.push('.css');
    context._resolve.extensions.push('.scss');

    if (mode === modes.production) {
        context._productionRules.push(rule);
        context._productionPlugins.push(miniCssExtractPlugin);
    }
    if (mode === modes.development) {
        context._developmentRules.push(rule);
        context._developmentPlugins.push(miniCssExtractPlugin);
        context._developmentPlugins.push(
            new StyleLintPlugin({
                configFile: styleLintConfigPath,
            })
        );
    }
};
