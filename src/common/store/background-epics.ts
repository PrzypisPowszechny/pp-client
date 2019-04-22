import { catchError, filter, ignoreElements, map, mergeMap, tap } from 'rxjs/operators';
import { defer, from, Observable, of } from 'rxjs';
import { combineEpics, Epic, ofType } from 'redux-observable';
import { locateAnnotations } from 'common/store/tabs/tab/annotations/actions';
import { AuthProcStages } from 'common/store/runtime/types';
import { cancelAuthProc, completeAuthProc, failAuthProc, SET_AUTH_PROC_STAGE } from 'common/store/runtime/actions';
import { retrieveRealActionTab, syncTabMark } from 'common/store/tabs/action-tab';
import { tabLocateAnnotations } from 'background/messages';
import { syncBadgeWithAnnotations } from 'background/badge';
import * as endpoints from '../api/endpoints';
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

export interface FluxStandardAction {
  type: string | symbol | any;
  payload?: any;
  error?: boolean | any;
  meta?: any;
}

export type PPEpic = Epic<FluxStandardAction, FluxStandardAction, IState>

export const locateEpic: PPEpic = (action$, state$) => action$.pipe(
  ofType('API_READ'),
  filter(action => action.payload.endpoint === endpoints.ANNOTATIONS),
  mergeMap(action => defer(
    async () => {
      const tabId = retrieveRealActionTab(action);
      const locationData = await tabLocateAnnotations(tabId, action.payload.data);
      syncBadgeWithAnnotations(locationData, tabId);
      const newAction = locateAnnotations(locationData);
      return syncTabMark(action, newAction);
    },
  )),
);

export const processAuthenticationEpic: PPEpic = (action$, state$) => (
  action$.pipe(
    ofType(SET_AUTH_PROC_STAGE),
    filter(() => !selectUser(state$.value)),
    filter(action => action.payload.stage === AuthProcStages.initiated),
    mergeMap( (action): Observable<FluxStandardAction> =>
      from(authenticate(action.payload.provider)).pipe(
        mergeMap( loginData =>
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

export const propagateAuthenticationDataEpic: PPEpic = action$ => (
  action$.pipe(
    filter(action => [USER_DATA_NEW, USER_ACCESS_TOKEN_REFRESHED, USER_DATA_CLEARED].includes(action.type)),
    // Perform side effect and ignore (do not map to new action)
    tap(() => dashboardMessaging.sendLoginData()),
    ignoreElements(),
  )
);

export const rootEpic = combineEpics(
  locateEpic,
  processAuthenticationEpic,
  propagateAuthenticationDataEpic,
);
