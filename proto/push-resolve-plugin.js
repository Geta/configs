module.exports = function(context, plugin) {
    context._resolve.plugins.push(plugin);
};
