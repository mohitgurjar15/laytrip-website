import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const layTripAdapter: EntityAdapter<any> = createEntityAdapter<any>({
});

export interface LayTrip extends EntityState<any> {
    isLoading?: boolean;
    error?: any;
    flightSearchResult?: any;
}

export const initialState: LayTrip = layTripAdapter.getInitialState(
    {
        isLoading: false,
        error: null,
        flightSearchResult: [],
    }
);
