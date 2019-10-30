module.exports = function(context, extensions) {
    context._resolve.extensions = context._resolve.extensions.concat(extensions);
};
