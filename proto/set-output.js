const path = require('path');

module.exports = function(context, outputPath, publicPath, nameFormat) {
    context._output.path = outputPath;
    context._output.publicPath = !publicPath ? outputPath : publicPath;
    context._output.filename = nameFormat;
};