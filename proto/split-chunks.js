module.exports = function(context, name, exp) {
    context._optimization['splitChunks'] = {
        cacheGroups: {
            commons: {
                test: exp,
                name: name,
                chunks: 'all',
            },
        },
    };
};
