import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as actions from './store/actions';
import * as selectors from './store/selectors';
import { State } from '../root-state';


@Injectable({ providedIn: 'root' })
export class LayTripStateStoreService {

    constructor(
        private store: Store<State>
    ) { }

    // CALL SELECTOR //
    // Get Campaign count
    selectFlightSearchResult(): Observable<any> {
        return this.store.pipe(select(selectors.selectFlightSearchResult));
    }

    // CALL DISPATCHER //
    dispatchGetFlightSearchResult(payload) {
        this.store.dispatch(new actions.LoadLaytripFlightSearchResultAction(payload));
    }
}
