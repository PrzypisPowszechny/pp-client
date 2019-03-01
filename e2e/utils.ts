export async function waitUntil(condition: () => boolean, timeout = 2000, interval = 20) {
  return new Promise((resolve) => {
    const start = Date.now();
    const timer = setInterval(
      () => {
        if (condition()) {
          clearInterval(timer);
          resolve(true);
        } else if (Date.now() - start > timeout) {
          clearInterval(timer);
          resolve(false);
        }
      }, interval);
  });
}

export async function dispatchDOMEvent(browser, name: string, attrs: any = {}) {
  return browser.executeScript(`
      var event = new CustomEvent('${name}', { detail: ${JSON.stringify(attrs)} });
      console.log(event);
      document.dispatchEvent(event);
    `);
}
