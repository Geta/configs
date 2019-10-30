const modes = require('../constants/modes');

module.exports = function(context, mode) {
    if (mode === modes.development) {
        context._devtool = 'inline-source-map';
    }
};
