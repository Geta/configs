# webpack.core.js

Generic webpack config wrapper that includes some standard configurations, and also adds a ton of pipeline functions to make life easier when managing your webpack config.

## Init

To initialize the config builder, simply require the ```webpack.core.js``` file into your webpack.config.js file, and initialize it, for example like this:

```js
const Config = require('geta-webpack-config-wrapper');

module.exports = (env) => {
    return new Config()
        // Add your pipeline functions here.
        .getConfig();
}
```

The ```new Config()``` initializes the function with some basic settings. Config takes two parameters, ```includePaths``` and ```excludePaths```, used across entire config. ```includePaths``` is by default undefined, and ```excludePaths``` is by default ```/node_modules/```. These are automatically applied to all rules in the config when ```.getConfig()``` is called.

Remember to always use [.getConfig()](#.getConfig()) in the end, to make it compile the config into a webpack readable format. I included the env variable in the example above because in most scenarios, you would want to have it to switch between production and dev builds etc. See the [.setMode()](#.setMode()) section for info on this.

## Valid modes

Modes are using string matching, and thus the following two modes are supported:

* ```production```
* ```development```

## Pipeline functions

This is a full overview of all the pipeline functions, what they do and include, if you don't want to read through the code.

### .addStyleConfig()

#### Arguments

* ```mode```: One of the valid modes listed [here](#valid-modes)
* ```basePath```: Base path to use for your project, by default set to ```__dirname```, which resolves to this package. To override, simply pass the path to the root folder of your project.

#### About

Applies a generic css / scss configuration to the config, using ExtractTextWebpackPlugin for extracting it into a own file. 

Based on the mode, it will enable inline source maps for development, and change output style between expanded for development, and compressed for production. This also enables the ```stylelint-webpack-plugin```.

### .pushRule()

#### Arguments

* ```rule```: the object of the rule you wish to add, same format as a ordinary webpack rule. No need to use ```include``` or ```exclude``` since these are auto applied by the [.getConfig()](#.getConfig()) function anyway.
* ```forDevelopment```: boolean or undefined (default), define if this should be a development or production rule. If undefined, will add to both production and development rulesets.

#### About

Adds a webpack rule object to your array of rules.

### .pushPlugin()

#### Arguments

* ```plugin```: The plugin you wish to add. Same format as a regular webpack plugin.
* ```forDevelopment```: boolean or undefined (default), define if this should be a development or production rule. If undefined, will add to both production and development rulesets.

#### About

Adds a webpack plugin to your array of plugins.

### .addEntry()

#### Arguments

* ```key```: Name of the entry, to use in the config. Make sure this is unique.
* ```value```: Value of the entry, can be either a string or array of strings. Path(s) to the entry file(s).

Adds the entry / entries to the webpack config.

### .setOutputPath()

#### Arguments

* ```dirName```: Root directory of the web project.
* ```outputPath```: Path to output directory from root directory.
* ```publicPath```: Optional, overrides the publicPath (used by some plugins) of the project from the outputPath property if set.

#### About

This alters the default path of the config from ```__dirname``` to whatever you wish.

### .setOutputNameFormat()

#### Arguments

* ```nameFormat```: name format of the output. For example ```[name].js```.

#### About

Alters the default name format of the config from ```[name].js``` to whatever you wish.

### .setMode()

#### Arguments

* ```mode```: One of the modes available [here](#valid-modes).

#### About

Sets the mode variable on the config, ensuring webpack conventions for dev or production env are added. Also used for the config when differentiating between a development and production config.

### .pushExtensions()

#### Arguments

* ```extensions```: Array of strings for the extension type to add, for example ```.md```. Each string is comma separated infinitely.

#### About

Adds a extension to resolve in the webpack config.

### .setTarget()

#### Arguments

* ```target```: string of the target to use in the webpack config.

#### About

Allows you to override the default target of the config. Default target is ```web```.

### .applyOptimizationsForProduction()

#### Arguments

* ```mode```: One of the modes available [here](#valid-modes).

#### About

Adds generic optimizations for production. Currently contains the ```uglifyjs-webpack-plugin``` and ```optimize-css-assets-webpack-plugin```.

### .addSourceMapsForDevelopment()

#### Arguments

* ```mode```: One of the modes available [here](#valid-modes).
* ```devtool```: Select one of the devtools available. Defaults to 'source-map'.

#### About

Sets the devtool of the webpack config to ```source-map``` in the development mode.

### .splitBundle()

#### Arguments

* ```name```: Name of the bundle to be split out.
* ```exp```: Expression for which content to include in the bundle. Defaults to content in node_modules.

#### About

Allows you to split the bundle, based on the regex expression provided.

### .addResolveAlias()

#### Arguments

* ```key```: Name of the alias.
* ```value```: Value of the alias.

#### About

Allows you to give various libraries aliases, such as $ for jQuery.

### .addTypescriptConfig()

#### Arguments

* ```mode```: One of the modes available [here](#valid-modes).

#### About

Adds TypeScript and TSLint support to the project. If mode is production, linter rule is not added. Also adds ```.ts``` and ```.tsx``` to supported extensions in config. For production mode, it will not type check the TypeScripts, increasing the performance of the build. Also on development mode it will do this, but also run a own service async with the webpack process checking types and linting, allowing it to perform better.

### .getConfig()

Formats the config into a object and returns it. The object is formatted following the webpack best practices. Enables watchmode if mode is development.

After the config is returned, it is possible to manually adjust the object in your config, if there are some use case which is not covered in this helper.