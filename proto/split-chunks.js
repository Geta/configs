const bundleTypes = require('../constants/bundle-types');

module.exports = function(context, bundleType, name, exp) {
    if (bundleType === bundleTypes.client) {
        context._optimization['splitChunks'] = {
            cacheGroups: {
                commons: {
                    test: exp,
                    name: name,
                    chunks: 'all',
                },
            },
        };
    }
};
