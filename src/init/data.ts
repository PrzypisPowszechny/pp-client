import * as chromeKeys from '../chrome-storage/keys';
import { changeAppModes } from '../store/appModes/actions';
import store from '../store';

import chromeStorage from 'chrome-storage';
import { readEndpoint } from 'redux-json-api';
import { DemagogAnnotationCategories } from '../api/demagog-annotations';
import { AnnotationProvider, AnnotationViewModel } from '../api/annotations';
import { uniqueTextToXPathRange } from '../utils/annotations';
import { setDemagogAnnotations } from '../store/demagogApi/actions';

export function loadInitialData() {
  // This is our root request that needs to have part of the url (path) hardcoded
  store.dispatch(readEndpoint('/annotations?url=' + window.location.href));
  loadDataFromDemagogAPI();
}

export function loadDataFromDemagogAPI() {
  // TODO call API; For now use mock data
  const demagogAnnotations = [
    {
      id: '1',
      attributes: {
        text: ' jest sprzeczny z prawem, ma obowiązek, nie tylko powinien, ale ma ',
        url: 'https://www.polskieradio.pl/13/53/Artykul/2175283,Sygnaly-Dnia-6-sierpnia-2018-roku-rozmowa-z-' +
        'Andrzejem-Halickim',
        sclass: DemagogAnnotationCategories.TRUE,
        date: new Date(),
        rating_text: 'Treść analizy',
      },
    },
  ];

  // Replace text identification with xpath identification, so user annotations and Demagog annotations format
  // is consistent
  const demagogAnnotationsMapped: AnnotationViewModel[] = demagogAnnotations.map(instance => ({
    id: `demagog.${instance.id}`,
    provider: AnnotationProvider.DEMAGOG,
    url: null,
    range: uniqueTextToXPathRange(instance.attributes.text, document.body),
    priority: null,
    demagogCategory: instance.attributes.sclass,
    comment: instance.attributes.rating_text,
    annotationLink: instance.attributes.url,
    annotationLinkTitle: 'Uzasadnienie opracowane przez zespół Demagoga',
    upvoteCountExceptUser: 0, // TODO
    doesBelongToUser: false,
    createDate: instance.attributes.date,
  })).filter(instance => instance.range);
  store.dispatch(setDemagogAnnotations(demagogAnnotationsMapped));

}

export function loadDataFromChromeStorage() {
  return new Promise((resolve, reject) => {
    chromeStorage.get([
      chromeKeys.ANNOTATION_MODE_PAGES,
      chromeKeys.DISABLED_EXTENSION,
      chromeKeys.DISABLED_PAGES,
    ], (result) => {
      const newAppModes = {
        annotationModePages: result[chromeKeys.ANNOTATION_MODE_PAGES] || [],
        isExtensionDisabled: result[chromeKeys.DISABLED_EXTENSION] || false,
        disabledPages: result[chromeKeys.DISABLED_PAGES] || [],
      };
      store.dispatch(changeAppModes(newAppModes));
      resolve();
    });
  });
}
