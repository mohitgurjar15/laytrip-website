import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as layTripActions from './actions';

import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';
import { State } from '../../root-state';
import { LayTripService } from '../services/layTrip.service';

// import { MessageType } from '../../core/models/message-type.enum';
// import { MESSAGE_CONSTANTS } from '../../core/constants/message.constant';
const getEmptyAction = (action: string, reason: string) => Object.assign({ type: `[layTrip] ${action} ${reason}` });

@Injectable()
export class LayTripEffects {
  constructor(
    private actions$: Actions,
    private store: Store<State>,
    private layTripService: LayTripService
  ) { }

  @Effect()
  loadFlightSearchResultEffect$: Observable<Action> = this.actions$.pipe(
    ofType<layTripActions.LoadLaytripFlightSearchResultAction>(layTripActions.ActionTypes.LOAD_LAYTRIP_FLIGHT_SEARCH_RESULT),
    withLatestFrom(this.store),
    switchMap(([action, state]) => {
      return this.layTripService.getFlightSearchResult(action.payload)
        .pipe(
          map((items: any) => new layTripActions.SuccessLaytripFlightSearchResultAction(items)),
          catchError(error =>
            of(new layTripActions.FailureAction(error))));
    })
  );
}

