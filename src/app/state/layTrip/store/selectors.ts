import {
    createFeatureSelector,
    createSelector,
    MemoizedSelector
} from '@ngrx/store';

import { LayTrip } from './state';

export const selectState: MemoizedSelector<
    object,
    LayTrip
> = createFeatureSelector<LayTrip>('layTrip');

// tslint:disable-next-line: no-shadowed-variable
const getFlightSearchResult = (state: LayTrip): any =>
    state && state.flightSearchResult;
export const selectFlightSearchResult: MemoizedSelector<object, any> = createSelector(
    selectState,
    getFlightSearchResult
);



