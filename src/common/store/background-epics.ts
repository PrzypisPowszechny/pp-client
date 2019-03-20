import { filter, mergeMap } from 'rxjs/operators';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { locateAnnotations } from 'common/store/tabs/tab/annotations/actions';
import { retrieveActionTab, syncTabMark } from 'common/store/tabs/action-tab';
import { tabLocateAnnotations } from 'background/messages';
import { syncBadgeWithAnnotations } from 'background/badge';

interface FluxStandardAction {
  type: string | symbol | any;
  payload?: any;
  error?: boolean | any;
  meta?: any;
}

export const locateEpic: Epic<FluxStandardAction> = action$ => action$.pipe(
  ofType('API_READ'),
  filter(action => action.payload.endpoint === 'annotations'),
  mergeMap(async (action) => {
    const tabId = retrieveActionTab(action);
    const locationData = await tabLocateAnnotations(tabId, action.payload.data);
    syncBadgeWithAnnotations(locationData, tabId);
    const newAction = locateAnnotations(locationData);
    return syncTabMark(action, newAction);
  }),
);

export const rootEpic = combineEpics(
  locateEpic,
);
