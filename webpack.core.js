var path = require('path');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var StyleLintPlugin = require('stylelint-webpack-plugin');

var modes = {
    production: 'production',
    development: 'development',
};

var baseRules = [
    {
        test: /\.jsx?$/,
        use: {
            loader: 'babel-loader',
        }
    },
    {
        test: /\.(svg|woff|woff2|eot|gif|ttf|cur|png)$/,
        use: {
            loader: 'url-loader',
            options: {
                name: 'static/[name].[hash].[ext]',
                limit: 10000
            }
        },
    },
];

var applyIncludeExclude = function(rules, include, exclude) {
    if (!rules || rules.length === 0 || !include && !exclude) {
        return;
    }

    var newRules = [];

    for (let i = 0; i < rules.length; i++) {
        var clonedRule = rules[i];

        if (include) {
            clonedRule['include'] = include;
        }

        if (exclude) {
            clonedRule['exclude'] = exclude;
        }

        newRules.push(clonedRule);
    }

    return newRules;
};

var config = function(includePaths = undefined, excludePaths = /node_modules/) {
    this._entry = {};
    this._output = {
        path: path.resolve(__dirname, ''),
        filename: '[name].js'
    };
    this._mode = modes.production;
    this._resolve = {
        modules: ["node_modules"],
        extensions: ['.js', '.jsx', '.json', '.scss', '.css']
    };
    this._include = includePaths;
    this._exclude = excludePaths;
    this._developmentRules = baseRules.concat([{
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'prettier-loader',
    }]);
    this._productionRules = baseRules;
    this._developmentPlugins = [];
    this._productionPlugins = [];
    this._target = 'web';
    this._optimization = {};
    this._devtool = false;
};

config.prototype.addStyleConfig = function(mode, basePath = __dirname) {
    var extractTextPlugin = new ExtractTextWebpackPlugin({
        filename: '[name].css',
    });
    var rule = {
        test: /\.s?css$/,
        use: extractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: __dirname
                        }
                    }
                },
                {
                    loader: 'sass-loader',
                    options: {
                        options: {
                            sourceMap: mode === modes.production ? false : 'inline',
                            outputStyle: mode === modes.production ? 'compressed' : 'expanded'
                        }
                    }
                }
            ]
        })
    };

    if (mode === modes.production) {
        this._productionRules.push(rule);
        this._productionPlugins.push(extractTextPlugin);
    } 
    if (mode === modes.development) {
        this._developmentRules.push(rule);
        this._developmentPlugins.push(extractTextPlugin);
        this._developmentPlugins.push(new StyleLintPlugin({
            files: basePath,
            configFile: __dirname + '/stylelint.config.js'
        }))
    }
    return this;
};

config.prototype.pushRule = function(rule, forDevelopment = undefined) {
    if (forDevelopment === undefined) {
        this._developmentRules.push(rule);
        this._productionRules.push(rule);
    } else if (forDevelopment === true) {
        this._developmentRules.push(rule);
    } else if (forDevelopment === false) {
        this._productionRules.push(rule);
    }
    return this;
};

config.prototype.pushPlugin = function(plugin, forDevelopment = undefined) {
    if (forDevelopment === undefined) {
        this._developmentPlugins.push(plugin);
        this._productionPlugins.push(plugin);
    } else if (forDevelopment === true) {
        this._developmentPlugins.push(plugin);
    } else if (forDevelopment === false) {
        this._productionPlugins.push(plugin);
    }
    return this;
};

config.prototype.addEntry = function(key, value) {
    this._entry[key] = value;
    return this;
};

config.prototype.setOutputPath = function(path) {
    this._output.path = path;
    return this;
};

config.prototype.setOutputNameFormat = function(nameFormat) {
    this._output.filename = nameFormat;
    return this;
};

config.prototype.setMode = function(mode) {
    this._mode = mode;
    return this;
};

config.prototype.pushExtension = function(extension) {
    this._resolve.extensions.push(extension);
    return this;
};

config.prototype.setTarget = function(target) {
    this._target = target;
    return this;
};

config.prototype.applyOptimizationsForProduction = function(mode) {
    if (mode === modes.production) {
        this._optimization['minimizer'] = [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            })
        ]
    }
    return this;
}

config.prototype.addSourceMapsForDevelopment = function(mode) {
    if (mode === modes.development) {
        this._devtool = 'source-map';
    }
    return this;
}

config.prototype.addTypescriptConfig = function(mode) {
    var rule = {
        test: /\.tsx?$/,
        use: {
            loader: 'ts-loader',
        }
    };
    var linter = {
        test: /\.tsx?$/,
        enforce: 'pre',
        loader: 'tslint-loader',
        options: {
            configFile: __dirname + '/tslint.json',
        }
    }
    var extensions = ['.ts', '.tsx'];
    if (mode === modes.production) {
        this._productionRules.push(rule);
        this._resolve.extensions = this._resolve.extensions.concat(extensions);
    } 
    if (mode === modes.development) {
        this._developmentRules.push(rule);
        this._developmentRules.push(linter);
        this._resolve.extensions = this._resolve.extensions.concat(extensions);
    }
    return this;
}

config.prototype.getConfig = function() {
    return {
        entry: this._entry,
        output: this._output,
        mode: this._mode,
        resolve: this._resolve,
        module: {
            rules: this._mode === modes.production ? applyIncludeExclude(this._productionRules, this._include, this._exclude) : applyIncludeExclude(this._developmentRules, this._include, this._exclude),
        },
        plugins: this._mode === modes.production ? this._productionPlugins : this._developmentPlugins,
        watch: this._mode !== modes.production,
        context: __dirname,
        target: this._target,
        devtool: this._devtool,
        optimization: this._optimization,
    }
};

module.exports = config;