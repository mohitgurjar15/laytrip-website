import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';

import { LayTripState } from './state';
import { state } from '@angular/animations';

export const selectState: MemoizedSelector<
    object,
    LayTripState
> = createFeatureSelector<LayTripState>('layTripState');

// tslint:disable-next-line: no-shadowed-variable
const getFlightSearchResult = (state: LayTripState): any =>
    state && state.flightSearchResult;
export const selectFlightSearchResult: MemoizedSelector<object, any> = createSelector(
    selectState,
    getFlightSearchResult
);



