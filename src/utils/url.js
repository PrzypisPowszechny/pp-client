// Url without protocol, not very strict validation
const urlRegex = new RegExp(/^(https?:\/\/)?[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,24}\b(\/[-a-zA-Z0-9@:%_\+.,~#?&//=]*)?$/gi);

export function extractHostname(url) {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("://") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

export function httpPrefixed(url) {
  if (url.indexOf("http://") === 0 || url.indexOf("https://") === 0 ) {
    return url;
  }
  return "http://" + url;
}

export function isValidUrl(url) {
  return url.match(urlRegex)
}

export function standardizeUrlForPageSettings(url) {
  //find & remove URL parameters
  return url.split('?')[0];
}
