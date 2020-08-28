import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as layTripStateActions from './actions';

import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { State } from '../../root-state';
import { LayTripStateService } from '../services/layTripState.service';

// import { MessageType } from '../../core/models/message-type.enum';
// import { MESSAGE_CONSTANTS } from '../../core/constants/message.constant';
const getEmptyAction = (action: string, reason: string) => Object.assign({ type: `[layTripState] ${action} ${reason}` });

@Injectable()
export class LayTripStateEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private layTripStateService: LayTripStateService
  ) { }

  @Effect()
  loadUsersEffect$: Observable<Action> = this.actions$.pipe(
    ofType<layTripStateActions.LoadLaytripFlightSearchResultAction>(layTripStateActions.ActionTypes.LOAD_LAYTRIP_FLIGHT_SEARCH_RESULT),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      return this.layTripStateService.getFlightSearchResult(action.payload)
        .pipe(
          map((items: any) => new layTripStateActions.SuccessLaytripFlightSearchResultAction(items)),
          catchError(error =>
            of(new layTripStateActions.FailureAction(error))));
      return of(getEmptyAction('', 'already loaded'));
    })
  );
}

