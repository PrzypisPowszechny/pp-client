[![CircleCI master](https://circleci.com/gh/PrzypisPowszechny/pp-client/tree/master.svg?style=shield)]()
[![CircleCI master](https://circleci.com/gh/PrzypisPowszechny/pp-client/tree/develop.svg?style=shield)]()



## Prerequisites

### Node.js setup

Ubuntu:
```
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs build-essential
```

macOS / Windows - install newest (LTS) version available from [official website](https://nodejs.org/en/).

Install packages

```
npm install
```

## Client app

Client app contains the pure add & read annotation functionality (90% of the application)

### Development

Just type the following command to launch a localhost with injected bundle
```
npm start
```
It uses `webpack-dev-server`, so every change is rebuilt live and the page is reloaded.
HMR (Hot Module Replacement) is enabled.


## Browser extension app

The browser extension uses the client app code as a Chrome extension `content_script`. So far, it only extends it with
- icon in the browser menu
- popup window (appearing when the icon is clicked)

### Development

To build the extension, run:
```
npm run build-dev-extension
```
After **every modification**, remember to run the build again to see the results
(it seems there are Hot Module Replacement tools for browser extensions, too; 
we should use them in the future).

#### Load the extension

See how to load the extension in [Chrome developer docs](https://developer.chrome.com/extensions/getstarted#unpacked) 
in **Load the extension** section. Choose `pp-client/dist` directory as the app root.

#### Reload the extension

After **every modification** to `pp-client` app you also need to reload the Chrome extension. 
[This reloading app](https://chrome.google.com/webstore/detail/extensions-reloader/fimgfedafeadlieiabdeeaodndnlbhid) 
is extremely useful. However, note that it acts up from time to time (and it's necessary to reload 
the extension by hand, in Chrome extension settings by clicking **reload**)
