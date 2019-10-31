const bundleTypes = require('../constants/bundle-types');
const modes = require('../constants/modes');
const HtmlPlugin = require('html-webpack-plugin');
const ExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const InsertAtBodyEndPlugin = require('../plugins/insert-at-body-end-plugin');

module.exports = function(
    context,
    mode,
    bundleType,
    source,
    dest,
    excludeAssets,
    destFileName,
    withReactInit
) {
    if (bundleType === bundleTypes.client) {
        const options = {
            inject: 'body',
            filename: dest,
            template: source,
            hash: true,
        };

        if (excludeAssets && excludeAssets.length > 0) {
            options['excludeAssets'] = excludeAssets;
        }

        const htmlPlugin = new HtmlPlugin(options);
        const excludeAssetsPlugin = new ExcludeAssetsPlugin();

        if (mode === modes.production) {
            context._productionPlugins.push(htmlPlugin);
            context._productionPlugins.push(excludeAssetsPlugin);

            if (withReactInit === true) {
                context._productionPlugins.push(
                    new InsertAtBodyEndPlugin({
                        filename: destFileName,
                        content: '@Html.ReactInitJavaScript()',
                    })
                );
            }
        } else if (mode === modes.development) {
            context._developmentPlugins.push(htmlPlugin);
            context._developmentPlugins.push(excludeAssetsPlugin);

            if (withReactInit === true) {
                context._developmentPlugins.push(
                    new InsertAtBodyEndPlugin({
                        filename: destFileName,
                        content: '@Html.ReactInitJavaScript()',
                    })
                );
            }
        }
    }
};
