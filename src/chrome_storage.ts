let storage;

if (PP_SETTINGS.DEV) {
  storage = chrome.storage.local;
} else {
  // Saves to this storage go to Google servers and are synced between many Google sessions on different PCs.
  storage = chrome.storage.sync;
}

export default storage;
