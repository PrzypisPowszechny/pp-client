const WebSocket = require('ws');
const {exec} = require('child_process');
const ps = require('ps-node');
/*
 * A utility to use with Chrome Extension hot reloading server (from webpack-chrome-extension-reloader)
 *
 * When the extension is rebuilt but Chrome is not open yet, opens Chrome loading temporarily the freshly compiled extension
 * It is currently the only way to load the extension programatically
 * (otherwise "google-chrome --load-extension" option is not effective)
 */

const hotReloadWsPath = 'ws://localhost:9090';
const ChromeInitURL = 'data:';
const N_ATTEMPTS = 100;
const ATTEMPT_INTERVAL = 500;

let attempts = 0;
let ws;
let handshakeOK = true;
// Handling globally emitted NodeJS ECONNREFUSED error seems to be the only viable way of
// handling WebSocket failure in constructor...
process.on('uncaughtException', function (err) {
  // Ignore econnrefused for web socket
  // console.log('UNCAUGHT EXCEPTION - keeping process alive:', err); // err.message is "foobar"
  if (err.errno === 'ECONNREFUSED') {
    attempts++;
    if (attempts < N_ATTEMPTS) {
      setTimeout(connectToReloadServer, ATTEMPT_INTERVAL);
      ws.removeAllListeners();
    }
  }
});

function isChromiumOpen() {
  return new Promise((resolve) => {
    ps.lookup({
        command: /(\/|\s)chromium-browser(\s|$)/,
      }, function (err, resultList) {
        if (resultList.length > 0) {
          resolve(true);
        } else {
          resolve(false);

        }
      }
    )
  });

}

function open() {
  console.log(`${__filename}: Opened the extension hot reloading connection`);
}

function message(data) {
  const type = JSON.parse(data).type;
  if (type === 'SIGN_CHANGE') {
    console.log(`${__filename}: Received a change signal from the hot reload server`);

    isChromiumOpen().then(result => {
      if (result) {
        console.log(`${__filename}: Open Chromium instance has been found; doing nothing...`);
      } else {
        console.log(`${__filename}: Opening Chromium instance...`);
        exec(`chromium-browser --load-extension=./dist/browser-extension/ "${ChromeInitURL}"`,
          (err, stdout, stderr) => {
            console.log(err, stdout, stderr);
          }
        );
      }
    });

  }
}


function connectToReloadServer() {
  // console.log('Connecting...')
  ws = new WebSocket(hotReloadWsPath); //, {handshakeTimeout: 1000000});
  ws.on('open', open);
  ws.on('message', message);
}

connectToReloadServer();
