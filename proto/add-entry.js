module.exports = function(context, key, value) {
    context._entry[key] = value;
};