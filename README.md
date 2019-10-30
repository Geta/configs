# Configs

Package containing a base webpack config wrapper, and configurations for various tools we use.

## Installation

### NPM

```powershell
npm install --save geta-webpack-config-wrapper
```

### Yarn

```powershell
yarn add geta-webpack-config-wrapper
```

## Includes

### Webpack

For webpack I've created a function, used to wrap the webpack config into a more readable / noob friendly format. It contains a ton of pipeline functions that serve various purposes. Overview of those and what they do can be found here: [index.js docs](docs/webpack.core.md)

### Babel

This one is automatically used by the ```index.js``` file.
Basic setup that includes the following presets:

* [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env)
* [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)
* [@babel/preset-stage-0](https://babeljs.io/docs/en/babel-preset-stage-0)

### PostCSS

Basic setup that adds some postcss transformations to the .scss files used. They're parsed using ```postcss-scss```. The ```index.js``` implements this by default.

For plugins I use these:

* ```postcss-sassy-import``` (adds support for imports)
* ````autoprefixer```` (uses browserconfig from your package.json)
* ```postcss-pxtorem``` (root value 16, affects font, font-size, line-height, letter-spacing props)

### Prettier

Also automatically implemented in index.js. Adds a basic prettier config to the solution. Currently only parses .ts and .tsx files, will add support for more languages soon-ish.

### Stylelint

Basic implementation of stylelint, extending the ```stylelint-config-standard``` with some extra rules / overrides I found useful. Support for scss added. Implemented by default in ```index.js```.

### TypeScript

For all my projects I use TypeScript, thus I've included a basic config file for it. This one already covers enough to be used on most projects, but can also be extended if you want to override or add additional options. To enable typescript in ```index.js```, see the [index.js docs](docs/webpack.core.md).

### TSLint

Since most of my projects use TypeScript, I also added my generic tslint config. It support extending in your own tslint config if you so wish. This one is also configured to work well with the Prettier config, so no weird conflicts occur between the auto formatting and the linter. Auto implemented in ```index.js``` when TypeScript is added, for dev mode only.
