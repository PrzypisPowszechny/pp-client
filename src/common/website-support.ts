

export interface WebsiteSupportItem {
  urls: RegExp[];
  message: string;
}

export class WebsiteSupport {

  protected items;

  constructor(items: WebsiteSupportItem[]) {
    this.items = items;
  }

  isBlacklisted(url: string): string | null {
    for (const item of this.items) {
      for (const urlPattern of item.urls) {
        if(urlPattern.test(url)) {
          console.debug(`Website is not supported: ${urlPattern}`);
          return item.message;
        }
      }
    }
    return null;
  }
}

export const blacklist: WebsiteSupportItem[] = [
  {
    urls: [
      /.*:\/\/(\S+\.)*google.(com|pl)(\/.*)?/i,
      /.*:\/\/(\S+\.)*wikipedia.org(\/.*)?/i,
      /.*:\/\/(\S+\.)*slack.com(\/.*)?/i,
      /.*:\/\/(\S+\.)*facebook.com(\/.*)?/i,
      /chrome:\/\/newtab\//i,
      /.*pdf/i,
      //i,
    ],
    message: 'Na tej stronie nie ma do czego dodać przypisu',
  },
];


export const defaultWebsiteSupport = new WebsiteSupport(blacklist);
