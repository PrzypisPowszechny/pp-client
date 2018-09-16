import qs from 'qs';
import sha256 from 'crypto-js/sha256';

const originParam = 'factcheck-user-came-from';

// converting json api object to simple json object
const convertStatement = (jao) => {
  // assert jao['type'] = 'statements'
  const ret = jao.attributes;

  ret['id'] = jao.id;
  if (jao['links']['self']) {
    ret['api_uri'] = jao['links']['self'];
  }

  return ret;
}

export const parseFCOrigin = (url) => {
  const parser = document.createElement('a');
  parser.href = url;

  const params = qs.parse(parser.search);

  return params[originParam];
}

export const encodeParams = (params) => {
  return qs.stringify(params);
};

export const hashUrl = (url) => {
  return sha256(url).toString();
};

export const getUserToken = () => {
  const pool = new Uint8Array(32);
  crypto.getRandomValues(pool);

  let uid = '';
  for (let i = 0; i < pool.length; ++i) {
    uid += pool[i].toString(16);
  }

  return uid;
};

export const getFacts = (url, uid, client, origin) => {
  return new Promise((resolve) => {
    const urlHash = hashUrl(url);
    const params = {
      uri: url, // todo hash
      client
    };

    if (origin) {
      params['origin'] = origin;
    }

    const apiurl = `${PP_SETTINGS.DEMAGOG_API_URL}/statements?${encodeParams(params)}`;
    console.info('[factchecker-plugin-chrome] Querying for facts.', apiurl);

    $.ajax({
      dataType: 'json',
      url: apiurl,
    }).then((response) => { // todo fail catching function( jqXHR, textStatus, errorThrown ) {
      const facts = [];
      if (response.error) {
        return resolve(facts);
      }

      if (response.data) {
        Object.keys(response.data).forEach(id => facts.push(convertStatement(response.data[id])));
      }

      resolve(facts);
    });
  });
};
