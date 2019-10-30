const modes = require('../constants/modes');

module.exports = function(context, plugin, forMode) {
    if (!forMode) {
        context._developmentPlugins.push(plugin);
        context._productionPlugins.push(plugin);
    } else if (forMode === modes.development) {
        context._developmentPlugins.push(plugin);
    } else if (forMode === modes.production) {
        context._productionPlugins.push(plugin);
    }
};
