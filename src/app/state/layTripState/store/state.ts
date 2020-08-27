import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

export const layTripStateAdapter: EntityAdapter<any> = createEntityAdapter<any>({
});

export interface LayTripState extends EntityState<any> {
    isLoading?: boolean;
    error?: any;
    flightSearchResult?: any;
}

export const initialState: LayTripState = layTripStateAdapter.getInitialState(
    {
        isLoading: false,
        error: null,
        flightSearchResult: [],
    }
);
