## Setup Overview

Two webpack configurations, both in webpack.config.js. One for server, one for client.

The client is always bundled using webpack + babel and sent from the server, using webpack-dev-middleware and webpack-hot-middleware, so it is made quickly and served from memory.
 
Server is written so you can:
 - run in development directly in babel-node (e.g. for testing)
 - serve using Browser Sync, to include hotloading middleware etc. (dev)
 - or build and run using node (production or dev - **forthcoming**)
 
Server launches in its own process, and new process is started every time the server rebuilds, and is proxied using BrowserSync. The proxy also dynamically adds in hot module loading, and reload when static assets update, and React Hot Module loading and React Transform.

TODO: Build the server. Not building because of relative path issues, in particular of non-static imports (e.g. all the plugins)

## Build Automation Tools

### Command line flags

All scripts in this section can be

Flag          | Description
------------- | --------------------------------------------------
`--release`   | Minimizes and optimizes the compiled output
`--verbose`   | Prints detailed information to the console
`--debugmode` | Launches the App in Debugging mode (e.g. with Redux devtools)

An additional `--` before flags is necessary to pass the arguments from babel-node to the actual process spawned (see examples).

#### `npm run start` (`start.js`)

* Cleans up the output `/build` directory (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Launches [Webpack](https://webpack.github.io/) compiler in a watch mode, and runs the server in a Browser Sync Proxy

##### Examples

Run the app for local development, with full sourcemapping etc.

```sh
$ npm run start
```

Launch dev server in production mode + minified

```sh
$ npm start -- --release
```

#### `npm run build` (`build.js`)

* Cleans up the output `/build` folder (`clean.js`)
* Copies static files to the output folder (`copy.js`)
* Creates application bundles with Webpack (`bundle.js`, `webpack.config.js`)

##### Examples

Build the app in production mode and log each step

```sh
$ npm run build -- --release --verbose
```

#### `npm run start-instance` (`start-instance.js`)

* clean, setup
* Bundle the client, and save it to the file system
* Run the server (using babel-node) without webpack middleware or file watchers

##### Examples

```sh
$ npm run start-instance
```

#### `npm run start-auth-stack` (`auth-stack.js`)

**Requires local install of `bio-user-platform`**

* Starts Docker
* Starts bio-user-platform
    * Authentication
    * Storage
* start server with authentication (`npm run auth`)

##### Additional Options

Flag                                           | Description
---------------------------------------------- | --------------------------------------------------
`--PLATFORM_PATH=/path/to/bio-user-platform/`  | Define path to bio-user-platform, defaults to sibling with project root
`--DEBUG`                                      | Log all output

##### Examples

Run using babel-node directly, and pass in a flag

```sh
$ babel-node tools/run auth-stack -- --DEBUG
```

## Misc

#### Files

* `webpack.config.js` - Webpack configuration for both client-side and server-side bundles
* `run.js` - Helps to launch other scripts with `babel-node` (e.g. `babel-node tools/run build`)
* `.eslintrc` - ESLint overrides for built automation scripts