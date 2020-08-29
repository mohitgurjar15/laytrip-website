import { initialState, LayTripState, layTripStateAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function reducer(state = initialState, action: Actions): LayTripState {
    switch (action.type) {
        // LOAD FLIGHT SEARCH RESULT
        case ActionTypes.LOAD_LAYTRIP_FLIGHT_SEARCH_RESULT: {
            return {
                ...state,
                flightSearchResult: null,
                error: null,
            };
        }
        // LOAD FLIGHT SEARCH RESULT SUCCESS
        case ActionTypes.SUCCESS_LAYTRIP_FLIGHT_SEARCH_RESULT: {
            return {
                ...state,
                flightSearchResult: action.payload,
                error: null,
            };
        }
        default:
            return state;
    }
}
