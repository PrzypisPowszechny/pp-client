import { catchError, filter, ignoreElements, map, mergeMap, tap } from 'rxjs/operators';
import { defer, from, Observable, of } from 'rxjs';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { locateAnnotations, locateCreatedAnnotations } from 'common/store/tabs/tab/annotations/actions';
import { AuthProcStages } from 'common/store/runtime/types';
import { cancelAuthProc, completeAuthProc, failAuthProc, SET_AUTH_PROC_STAGE } from 'common/store/runtime/actions';
import { retrieveLogicalActionTab, retrieveRealActionTab, syncTabMark } from 'common/store/tabs/action-tab';
import { tabLocateAnnotations } from 'background/messages';
import { syncBadgeWithAnnotations } from 'background/badge';
import * as resourceTypes from '../api/resource-types';
import { IState } from 'common/store/reducer';
import { authenticate } from 'background/auth';
import * as Sentry from '@sentry/browser';
import {
  USER_ACCESS_TOKEN_REFRESHED,
  USER_DATA_CLEARED,
  USER_DATA_NEW,
  userDataNew,
} from 'common/store/storage/actions';
import dashboardMessaging from 'background/dashboard-messaging';
import { selectUser } from 'common/store/storage/selectors';
import { locateAnnotationRequests, locateCreatedAnnotationRequests } from './tabs/tab/annotationRequests/actions';
import { getActionResourceType } from '../api/utils';

export interface FluxStandardAction {
  type: string | symbol | any;
  payload?: any;
  error?: boolean | any;
  meta?: any;
}

export type StandardEpic = Epic<FluxStandardAction, FluxStandardAction, IState>;

// locate annotations just loaded from API
export const annotationLocateEpic: StandardEpic = (action$, state$) => action$.pipe(
  ofType('API_READ'),
  filter(action => getActionResourceType(action) === resourceTypes.ANNOTATIONS),
  mergeMap(action => defer(
    async () => {
      const tabId = retrieveLogicalActionTab(action, state$.value.tabs);
      const locationData = await tabLocateAnnotations(tabId, action.payload.data);
      syncBadgeWithAnnotations(locationData, tabId);
      const newAction = locateAnnotations(locationData);
      return syncTabMark(action, newAction);
    },
  )),
);

// locate annotations just loaded from API
export const annotationRequestLocateEpic: StandardEpic = (action$, state$) => action$.pipe(
  ofType('API_READ'),
  filter(action => getActionResourceType(action) === resourceTypes.ANNOTATION_REQUESTS),
  mergeMap(action => defer(
    async () => {
      const tabId = retrieveLogicalActionTab(action, state$.value.tabs);
      const locationData = await tabLocateAnnotations(tabId, action.payload.data);
      // TODO anything to do with badge?
      const newAction = locateAnnotationRequests(locationData);
      return syncTabMark(action, newAction);
    },
  )),
);

export const annotationLocateCreatedEpic: StandardEpic = (action$, state$) => action$.pipe(
  ofType('API_CREATED'),
  filter(action => getActionResourceType(action) === resourceTypes.ANNOTATIONS),
  mergeMap(action => defer(
    async () => {
      const tabId = retrieveLogicalActionTab(action, state$.value.tabs);
      const locationData = await tabLocateAnnotations(tabId, [action.payload.data]);
      // TODO sync with badge
      const newAction = locateCreatedAnnotations(locationData);
      return syncTabMark(action, newAction);
    },
  )),
);

export const annotationRequestLocateCreatedEpic: StandardEpic = (action$, state$) => action$.pipe(
  ofType('API_CREATED'),
  filter(action => getActionResourceType(action) === resourceTypes.ANNOTATION_REQUESTS),
  mergeMap(action => defer(
    async () => {
      const tabId = retrieveLogicalActionTab(action, state$.value.tabs);
      const locationData = await tabLocateAnnotations(tabId, [action.payload.data]);
      // TODO anything to do with badge?
      const newAction = locateCreatedAnnotationRequests(locationData);
      return syncTabMark(action, newAction);
    },
  )),
);

export const processAuthenticationEpic: StandardEpic = (action$, state$) => (
  action$.pipe(
    ofType(SET_AUTH_PROC_STAGE),
    filter(() => !selectUser(state$.value)),
    filter(action => action.payload.stage === AuthProcStages.initiated),
    mergeMap((action): Observable<FluxStandardAction> =>
      from(authenticate(action.payload.provider)).pipe(
        mergeMap(loginData =>
          loginData ? of(
            completeAuthProc(),
            userDataNew(loginData),
          ) : of(
            cancelAuthProc('Anulowano autoryzację'),
          ),
        ),
        catchError((err) => {
          Sentry.captureException(err);
          return of(failAuthProc('Wystąpił bład podczas logowania'));
        }),
        map(newAction => syncTabMark(action, newAction)),
      ),
    ),
  )
);

export const propagateAuthenticationDataEpic: StandardEpic = action$ => (
  action$.pipe(
    filter(action => [USER_DATA_NEW, USER_ACCESS_TOKEN_REFRESHED, USER_DATA_CLEARED].includes(action.type)),
    // Perform side effect and ignore (do not map to new action)
    tap(() => dashboardMessaging.sendLoginData()),
    ignoreElements(),
  )
);

export const rootEpic = combineEpics(
  annotationLocateEpic,
  annotationRequestLocateEpic,
  annotationLocateCreatedEpic,
  annotationRequestLocateCreatedEpic,
  processAuthenticationEpic,
  propagateAuthenticationDataEpic,
);
