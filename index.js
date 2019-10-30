var path = require('path');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const defaultConfigOptions = require('./constants/config-options');
const defaultStyleConfigOptions = require('./constants/style-config-options');
const defaultOutputOptions = require('./constants/output-options');
const addStyleConfig = require('./proto/add-style-config');
const pushRule = require('./proto/push-rule');
const pushPlugin = require('./proto/push-plugin');
const addEntry = require('./proto/add-entry');
const setOutput = require('./proto/set-output');
const pushExtensions = require('./proto/push-extensions');
const setTarget = require('./proto/set-target');
const withOptimizations = require('./proto/with-optimizations');
const withDevtools = require('./proto/with-devtools');

const modes = {
    production: 'production',
    development: 'development',
};

const defaultRules = [
    {
        test: /\.(svg|woff|woff2|eot|gif|ttf|cur|png)$/,
        use: {
            loader: 'url-loader',
            options: {
                name: 'static/[name].[hash].[ext]',
                limit: 10000,
            },
        },
    },
];

const applyIncludeExclude = function(rules, include, exclude) {
    if (!rules || rules.length === 0 || (!include && !exclude)) {
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

var config = function(options = defaultConfigOptions) {
    this._context = options.root;
    this._entry = {};
    this._output = {};
    this._mode = modes.production;
    this._resolve = {
        modules: ['node_modules'],
        extensions: ['.js', '.jsx', '.json', '.scss', '.css'],
        alias: {},
        plugins: [],
    };
    this._include = options.includePaths;
    this._exclude = options.excludePaths;
    this._developmentRules = defaultRules;
    this._productionRules = defaultRules;
    this._developmentPlugins = [];
    this._productionPlugins = [];
    this._target = 'web';
    this._optimization = {};
    this._devtool = false;
};

config.prototype.addStyleConfig = function(options = defaultStyleConfigOptions) {
    addStyleConfig(this, this._mode, options.postCssConfigPath, options.styleLintConfigPath);
    return this;
};

config.prototype.pushRule = function(rule, forMode = null) {
    pushRule(this, rule, forMode);
    return this;
};

config.prototype.pushPlugin = function(plugin, forMode = null) {
    pushPlugin(this, plugin, forMode);
    return this;
};

config.prototype.addEntry = function(key, value) {
    addEntry(this, key, value);
    return this;
};

config.prototype.setOutput = function(options = defaultOutputOptions) {
    setOutput(this, options.outputPath, options.publicPath, options.nameFormat);
    return this;
};

config.prototype.pushExtensions = function(...extensions) {
    pushExtensions(this, extensions);
    return this;
};

config.prototype.setTarget = function(target) {
    setTarget(this, target);
    return this;
};

config.prototype.withOptimizations = function() {
    withOptimizations(this, this._mode);
    return this;
};

config.prototype.withDevtools = function() {
    withDevtools(this, this._mode);
    return this;
};

config.prototype.addResolveAlias = function(key, value) {
    this._resolve.alias[key] = value;
    return this;
};

config.prototype.splitBundle = function(name, exp = /[\\/]node_modules[\\/]/) {
    this._optimization['splitChunks'] = {
        cacheGroups: {
            commons: {
                test: exp,
                name: name,
                chunks: 'all',
            },
        },
    };
    return this;
};

config.prototype.addTypescriptConfig = function(
    mode,
    tsConfig = path.resolve(__dirname, 'tsconfig.json'),
    lintConfig = path.resolve(__dirname, 'tslint.json')
) {
    var rule = {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
            transpileOnly: mode !== modes.production,
        },
    };
    var extensions = ['.ts', '.tsx'];
    var pathsPlugin = new TsconfigPathsPlugin({ configFile: tsConfig });
    var typeCheckerPlugin = new ForkTsCheckerWebpackPlugin({
        tsconfig: tsConfig,
        tslint: lintConfig,
    });

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
};

config.prototype.getConfig = function() {
    return {
        entry: this._entry,
        output: this._output,
        mode: this._mode,
        resolve: this._resolve,
        module: {
            rules:
                this._mode === modes.production
                    ? applyIncludeExclude(this._productionRules, this._include, this._exclude)
                    : applyIncludeExclude(this._developmentRules, this._include, this._exclude),
        },
        plugins:
            this._mode === modes.production ? this._productionPlugins : this._developmentPlugins,
        watch: this._mode !== modes.production,
        context: __dirname,
        target: this._target,
        devtool: this._devtool,
        optimization: this._optimization,
    };
};

module.exports = config;
