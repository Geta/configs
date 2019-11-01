const modes = require('../constants/modes');

module.exports = function(context, mode, include, exclude) {
    const babelRule = {
        test: /\.jsx?$/,
        use: 'babel-loader',
        include: include,
        exclude: exclude,
    };

    context._resolve.extensions.push('.jsx');
    if (context._resolve.extensions.indexOf('.js') === -1) {
        context._resolve.extensions.push('.js');
    }

    if (mode === modes.production) {
        context._productionRules.push(babelRule);
    } else if (mode === modes.development) {
        context._developmentRules.push(babelRule);
    }
};
