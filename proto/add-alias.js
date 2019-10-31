module.exports = function(context, key, value) {
    context._resolve.alias[key] = value;
};
