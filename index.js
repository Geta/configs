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
    this._mode = options.mode;
    this._bundleType = options.bundleType;
    this._resolve = {
        modules: ['node_modules'],
        extensions: ['.json', '.svg', '.woff', '.woff2', '.eot', '.gif', '.ttf', '.cur', '.png'],
        alias: {},
        plugins: [],
    };
    this._include = !options.includePaths ? defaultConfigOptions.includePaths : options.includePaths;
    this._exclude = !options.excludePaths ? defaultConfigOptions.excludePaths : options.excludePaths;
    this._developmentRules = defaultRules;
    this._productionRules = defaultRules;
    this._developmentPlugins = [];
    this._productionPlugins = [];
    this._target = 'web';
    this._optimization = {};
    this._devtool = false;
};

config.prototype.addStyleConfig = function(options = defaultStyleConfigOptions) {
    options = assign({}, defaultStyleConfigOptions, options);
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

config.prototype.addTypeScript = function() {
    addTypeScript(this, this._mode);
    return this;
};

config.prototype.addBabel = function() {
    addBabel(this, this._mode);
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
            rules:
                this._mode === modes.production
                    ? applyIncludeExclude(this._productionRules, this._include, this._exclude)
                    : applyIncludeExclude(this._developmentRules, this._include, this._exclude),
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
