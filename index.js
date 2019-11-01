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
const addAlias = require('./proto/add-alias');
const splitChunks = require('./proto/split-chunks');
const addTypeScript = require('./proto/add-typescript');
const addBabel = require('./proto/add-babel');
const modes = require('./constants/modes');
const addShellRunner = require('./proto/add-shell-runner');
const defaultShellRunnerOptions = require('./constants/shell-runner-options');
const addFileCopy = require('./proto/add-file-copy');
const addHtmlTransformer = require('./proto/add-html-transformer');
const defaultHtmlTransformerOptions = require('./constants/html-transformer-options');
const addCdn = require('./proto/add-cdn');
const addStats = require('./proto/add-stats');
const pushResolvePlugin = require('./proto/push-resolve-plugin');
const assign = require('nested-object-assign');
const defaultIncludeExcludeOptions = require('./constants/include-exclude-options');

function defaultRules(options = defaultIncludeExcludeOptions) {
    const assetsRule = {
            test: /\.(svg|woff|woff2|eot|gif|ttf|cur|png)$/,
            use: {
                loader: 'url-loader',
                options: {
                    name: 'static/[name].[hash].[ext]',
                    limit: 10000,
                },
            },
        };

    if (options.include) {
        assetsRule['include'] = options.include;
    }

    if (options.exclude) {
        assetsRule['exclude'] = options.exclude;
    }

    return [
        assetsRule
    ];
}

var config = function(options = defaultConfigOptions) {
    this._context = options.root;
    this._entry = {};
    this._output = {};
    this._mode = options.mode;
    this._bundleType = options.bundleType;
    this._resolve = {
        modules: ['node_modules'],
        extensions: ['.json', '.svg', '.woff', '.woff2', '.eot', '.gif', '.ttf', '.cur', '.png'],
        alias: {},
        plugins: [],
    };
    this._developmentRules = defaultRules(options);
    this._productionRules = defaultRules(options);
    this._developmentPlugins = [];
    this._productionPlugins = [];
    this._target = 'web';
    this._optimization = {};
    this._devtool = false;
};

config.prototype.addStyleConfig = function(options = defaultStyleConfigOptions) {
    const transformedOptions = assign({}, defaultStyleConfigOptions, options);
    if (options.include) {
        transformedOptions['include'] = options.include;
    }
    if (options.exclude) {
        transformedOptions['exclude'] = options.exclude;
    }

    addStyleConfig(this, this._mode, transformedOptions.postCssConfigPath, transformedOptions.styleLintConfigPath, transformedOptions.include, transformedOptions.exclude);
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
    options = assign({}, defaultOutputOptions, options);
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
    addAlias(this, key, value);
    return this;
};

config.prototype.splitChunks = function(name, exp = /[\\/]node_modules[\\/]/) {
    splitChunks(this, name, exp);
    return this;
};

config.prototype.addTypeScript = function(options = defaultIncludeExcludeOptions) {
    addTypeScript(this, this._mode, options.include, options.exclude);
    return this;
};

config.prototype.addBabel = function(options = defaultIncludeExcludeOptions) {
    addBabel(this, this._mode, options.include, options.exclude);
    return this;
};

config.prototype.addShellRunner = function(options = defaultShellRunnerOptions) {
    options = assign({}, defaultShellRunnerOptions, options);
    addShellRunner(
        this,
        this._mode,
        this._bundleType,
        options.onBuildStart,
        options.onBuildEnd,
        options.verbose
    );
    return this;
};

config.prototype.addFileCopy = function(...rules) {
    addFileCopy(this, this._mode, this._bundleType, rules);
    return this;
};

config.prototype.addHtmlTransformer = function(options = defaultHtmlTransformerOptions) {
    options = assign({}, defaultHtmlTransformerOptions, options);
    addHtmlTransformer(
        this,
        this._mode,
        this._bundleType,
        options.source,
        options.dest,
        options.excludeAssets,
        options.destFileName,
        options.withReactInit
    );
    return this;
};

config.prototype.addCdn = function(modules = []) {
    addCdn(this, this._mode, this._bundleType, modules);
    return this;
};

config.prototype.addStats = function() {
    addStats(this, this._mode);
    return this;
};

config.prototype.pushResolvePlugin = function(plugin) {
    pushResolvePlugin(this, plugin);
    return this;
};

config.prototype.getConfig = config.prototype.getConfig = function() {
    return {
        context: this._context,
        entry: this._entry,
        output: this._output,
        mode: this._mode,
        resolve: this._resolve,
        module: {
            rules: this._mode === modes.production ? this._productionRules : this._developmentRules,
        },
        plugins:
            this._mode === modes.production ? this._productionPlugins : this._developmentPlugins,
        watch: this._mode !== modes.production,
        target: this._target,
        devtool: this._devtool,
        optimization: this._optimization,
    };
};

module.exports = config;
