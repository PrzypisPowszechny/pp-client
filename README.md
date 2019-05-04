[![CircleCI](https://circleci.com/gh/PrzypisPowszechny/pp-client/tree/master.svg?style=shield)](https://circleci.com/gh/PrzypisPowszechny/pp-client/tree/master)



1. [About & Preview](#about)
2. [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Building](#building)
    - [Connecting to backend](#connecting-to-backend)
    - [Tests](#tests)
3. [Architecture](#architecture)
4. [More & References](#more)

---

# About

Chrome extension for enhancing websites with annotations available to the visitors at the very moment of reading. 

Using this tool communities focused on fact-checking can serve their content contextually and effectively improve 
the reliability of information people source from the internet.

### Preview of adding an annotation

![Extension in action movie](./docs/adding-annotation-movie.gif)


# Development

## Prerequisites

### Node.js setup

Ubuntu:
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
```

macOS - install newest (LTS) version available from [official website](https://nodejs.org/en/).

Install packages

```
npm install
```

## pp-client as a browser extension

Chrome extensions have very clear constraints on their structure.
Although we currently only support Chrome, browser extensions as such have largely been standardized, so we can roughly talk
about browser extensions in general.

Full extension configuration is defined in `manifest.json`.

Parts relevant to our application -- the ones we actually implement:

- background script
- content scripts
- popup window (appearing when the extension icon is clicked)
- extension icon

We further use some resources unique to Chrome extensions
- chrome storage
- chrome message API


#### _Client_ term

Since **content scripts** are injected to every page visited by the extension's user,
they are technically very much like regular scripts attached by the website author himself (except we are injecting them, yes).

Exploiting the analogy, we can call this part of the application shortly the **client** part.

## Building

Long story short: for hot reloading development you probably just want to run:
```
npm run start
```
_How to install it in the browser?_ Go to [installing extension](#installing-extension).

### Building browser extension 

Builds vary in speed, size and debuggability. On the one end there is `start` script which is hot reloding while on the other you have `build-optimized` and `build-package` which use the same configuration as produciton builds (with the only differences being the servers and services the extension connects to).

Both `build` and `start` builds will compile to a `dist/browser-extension` directory. More about adding the extension to chrome in next section [installing extension](#installing-extension).

**hot reloading**

It is best to develop on Chromium, since it is more or less the same as Chrome and it does not interfere with personal tabs (reloading them etc.).
To install Chromium on Ubuntu, run:
```
sudo apt-get install chromium-browser
```

Start work with no Chromium open.

```
npm run start
```

When there is no running Chrome instance, one will be opened and the extension will be loaded.
There is currently no way to programatically load an extension to a running Chrome instance (for security reasons).

An already running Chrome extension may result in errors and the extension will have to be removed and loaded manually.

**single build**
```
npm run build
```

**single _production-like_ build**  - Optimized, minified and obfusticated.
```
npm run build-optimized
```  

**single packed _production-like_ build** - Packed to `dist/pp-chrome.zip` and ready for uploading to Chrome Web Store.
```
npm run build-package
```


### Installing extension

Go to Chrome extension page and load the extension (to see how to load an extension go to
[Chrome developer docs](https://developer.chrome.com/extensions/getstarted#unpacked)
to **Load the extension** section). Choose `dist/browser-extension` directory as the app root.

**Alternatively**: spare yourself few clicks and use commandline: 
```
chromium-browser --load-extension=./dist/browser-extension
```  
You may also replace `chromium-browser` with `google-chrome`. 

A rebuild of the browser package (`dist/browser-extension`) won't normally reload the browser extension already loaded by Chrome.

**If you're using hot reloading**, each change to one of the content scripts or popup window
(to be precise, in Webpack terms -- any dependency of the entry points,
which are marked as either `content_script` or `default_popup` in `manifest.json`) will cause Chrome to reload the extension.

**If you're not using hot reloading**, you need to manually refresh the browser extension in Chrome's extension page.

When the extension has been reloaded, you still need to refresh each opened tab for the change to take effect in that very tab.

### Further notes on (hot) reloading

As for now, this part of the hot reloading plugin is not fully clear.
It reloads some of the open tabs (I'm not sure how it chooses which).
Most of the time, only the last used.

Needless to say, without hot reloading you need to reload the tab manually.

- Hot reloading **does not reload anything on the first build**; it's best to start off with running it,
and introduce changes to the code just then, rather than build only when it's needed.
- If you don't see a change you expect to have made in the extension,
**make sure that the tab has in fact been reloaded**
    - it's clearly visible with the devTools open;
    - a separate monitor with the current tab on top is also very handy in subconsciously supervising the refreshing

- if you're not sure the extension has been reloaded by Chrome, you can do it manually;
but rather than use Chrome extension page, it's quicker to use 
[this reloading app](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid).

## Content script (= client-only) builds
All builds compile to a `dist/client` directory.

**~~client + hot reloading~~**
_Out of operation for now._ 
```
npm run start-client
```

**~~client compilation~~** 
_Out of operation for now._ 
```
npm run build-client
```

## Modifying packages
We usually want to install the exact version of a package to ensure no differences between our development environments.
You can set it the default behaviour when installing new package from commandline.
```
npm config set save-exact=true
```
From now on, commands like `npm install <package>` will specify an exact package version when saving it in `package.json`.

## Connecting to backend

This application works with PrzypisPowszechny API server - https://github.com/PrzypisPowszechny/pp.

#### Default instance
By default it set to connect to public development instance of the server. 

#### Local instance
If you want to connect to your local instance, add `--env.PP_API=local` arg to command starting client or just set `PP_API=local` environment var, e.g.
```
npm run start -- --env.PP_API=local
```
which is equivalent to
```
PP_API=local npm run start
```
All development values of `PP_API`:
 - `local` - localhost port 8000
 - `local-alt` - localhost port 8080
 - `devdeploy1` - (default) remote development instace, always online


### Documentation of the backend API

**[Documentation of the latest release](https://app.przypispowszechny.pl/api/docs/)**

For every instance there is a swagger documentation of all endpoints, hosted at the below path (note ending slash)
```
 /api/docs/
 ```

So for example, to see the shape of the backend you are developing to, when running a backend instance locally, just visit:
```
http://localhost:8000/api/docs/
```

## Tests

Just run
```
npm run test
```

### e2e Tests

Build and then run e2e tests, for example:
```
PP_API=local npm run build && PP_API=local npm run e2e 
```
Notes:
- `PP_API` for **build and e2e have to match**
- only localhost with free port are valid for e2e, so you can set either `local` or `local-alt` (not to clash with local dev server) 
- you **can** run e2e tests against hot reloading build, just remember about `PP_API` match ;)  


### annotation validation
```
npm run validate-annotations
```
Notes:
- sentry information is logged in a separate sentry project
- only actual exceptions are logged to sentry (not unlocated annotations)

# Read more

[Development -- details](docs/dev-details.md)

[More notes on building](docs/build.md)

[Annotating DOM](docs/DOM-annotation.md)

[Valuable references](docs/references.md)
