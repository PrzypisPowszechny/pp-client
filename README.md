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

## Development

Just type the following command to launch a localhost with injected bundle
```
npm start
```
It uses `webpack-dev-server`, so every change is rebuilt live and the page is reloaded.
HMR (Hot Module Replacement) is enabled.
