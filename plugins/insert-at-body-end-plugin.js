const CLOSE_BODY_TAG = '</body>';

function InsertAtBodyEnd(options) {
    this.options = options;

    if (!this.options.filename)
        throw new Error(
            'insert-at-body-end-plugin requires a filename property to be set in the options'
        );
    if (!this.options.content)
        throw new Error(
            'insert-at-body-end-plugin requires a content property to be set in the options'
        );
}

InsertAtBodyEnd.prototype.apply = function(compiler) {
    const that = this;
    compiler.hooks.compilation.tap('InsertAtBodyEnd', compilation => {
        compilation.hooks.htmlWebpackPluginAfterHtmlProcessing.tapAsync(
            'InsertAtBodyEnd',
            (data, callback) => {
                if (data.plugin.options.filename.indexOf(that.options.filename) === -1)
                    return callback(null, data);

                data.html = data.html.replace(
                    CLOSE_BODY_TAG,
                    that.options.content + CLOSE_BODY_TAG
                );
                callback(null, data);
            }
        );
    });
};

module.exports = InsertAtBodyEnd;
