const modes = require('modes');

module.exports = {
    root: __dirname,
    mode: modes.development,
    includePaths: undefined,
    excludePaths: /node_modules/,
};
