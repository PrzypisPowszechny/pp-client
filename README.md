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

As for now, a bare-bones version is configured. First, build the app
using:
```
npm run dev
```
It launches webpack in watch mode, so every change will be rebuilt live.


