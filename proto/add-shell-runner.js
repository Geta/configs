const ShellRunner = require('webpack-shell-runner');
const bundleTypes = require('../constants/bundle-types');
const modes = require('../constants/modes');

module.exports = function(context, mode, bundleType, onBuildStart, onBuildEnd, verbose) {
    if (bundleType === bundleTypes.client) {
        const plugin = new ShellRunner({
            onBuildStart: onBuildStart,
            onBuildEnd: onBuildEnd,
            verbose: verbose,
        });

        if (mode === modes.production) {
            context._productionPlugins.push(plugin);
        } else if (mode === modes.development) {
            context._developmentPlugins.push(plugin);
        }
    }
};
