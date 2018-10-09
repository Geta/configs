var path = require('path');
var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var StyleLintPlugin = require('stylelint-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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
        extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
        alias: {},
        plugins: []
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
            context: basePath,
            configFile: path.resolve(__dirname, 'stylelint.config.js')
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

config.prototype.setOutputPath = function(dirName, outputPath, publicPath = undefined) {
    this._output.path = path.join(dirName, outputPath);
    this._output.publicPath = publicPath === undefined ? outputPath : publicPath;
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

config.prototype.pushExtensions = function(...extensions) {
    this._resolve.extensions = this._resolve.extensions.concat(extensions);
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
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    }
    return this;
}

config.prototype.addSourceMapsForDevelopment = function(mode, devtool = 'source-map') {
    if (mode === modes.development) {
        this._devtool = devtool;
    }
    return this;
}

config.prototype.addResolveAlias = function(key, value) {
    this._resolve.alias[key] = value;
    return this;
}

config.prototype.splitBundle = function(name, exp = /[\\/]node_modules[\\/]/) {
    this._optimization['splitChunks'] = {
        cacheGroups: {
            commons: {
                test: exp,
                name: name,
                chunks: 'all'
            }
        }
    }
    return this;
}

config.prototype.addTypescriptConfig = function(mode, tsConfig = path.resolve(__dirname, 'tsconfig.json'), lintConfig = path.resolve(__dirname, 'tslint.json')) {
    var rule = {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
            transpileOnly: mode !== modes.production
        }
    };
    var extensions = ['.ts', '.tsx'];
    var pathsPlugin = new TsconfigPathsPlugin({ configFile: tsConfig });
    var typeCheckerPlugin = new ForkTsCheckerWebpackPlugin(
        { 
            tsconfig: tsConfig,
            tslint: lintConfig
        }
    );

    this._resolve.extensions = this._resolve.extensions.concat(extensions);
    this._resolve.plugins.push(pathsPlugin);

    if (mode === modes.production) {
        this._productionRules.push(rule);
    } 
    if (mode === modes.development) {
        this._developmentRules.push(rule);
        this._developmentPlugins.push(typeCheckerPlugin);
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
