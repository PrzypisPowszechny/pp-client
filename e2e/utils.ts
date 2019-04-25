import { IWebDriver } from 'selenium-webdriver';

export async function sleep(ms) {
  await new Promise(resolve => setTimeout(resolve, ms));
}

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

export async function dispatchDOMEvent(browser: IWebDriver, name: string, data: any = {}) {
  return browser.executeScript(`
      var event = new CustomEvent('${name}', { detail: ${JSON.stringify(data)} });
      console.log('event dispatched by selenium:', event);
      document.dispatchEvent(event);
    `);
}

export async function newTab(browser: IWebDriver) {
  await browser.executeScript('window.open()');
}

export async function switchToTab(browser, tabIndex: number) {
  const tabs = await browser.getAllWindowHandles();
  await browser.switchTo().window(tabs[tabIndex]);
}