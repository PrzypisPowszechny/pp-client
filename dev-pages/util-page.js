document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('open-background').onclick = function (e) {
    chrome.runtime.sendMessage({action: 'DEV_BACKGROUND_PAGE_OPEN'});
  }

  document.getElementById('open-popup').onclick = function (e) {
    chrome.runtime.sendMessage({action: 'DEV_POPUP_OPEN'});
  }
});

