console.log('Przypis background script!');

// NOTE: This page is also used for hot reloading in webpack-chrome-extension-reloader

function onContextMenuAnnotate() {
  chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'ANNOTATE' });
  });
}

chrome.contextMenus.create({
  title: 'Dodaj przypis',
  contexts: ['selection'],
  onclick: onContextMenuAnnotate,
});
