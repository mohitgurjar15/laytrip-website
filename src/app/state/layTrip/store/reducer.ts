import { initialState, LayTrip } from './state';
import { Actions, ActionTypes, FailureAction } from './actions';

export function reducer(state = initialState, action: Actions): LayTrip {
    switch (action.type) {
        // LOAD FLIGHT SEARCH RESULT
        case ActionTypes.LOAD_LAYTRIP_FLIGHT_SEARCH_RESULT: {
            return {
                ...state,
                isLoading: true,
                flightSearchResult: null,
                error: null,
            };
        }
        // LOAD FLIGHT SEARCH RESULT SUCCESS
        case ActionTypes.SUCCESS_LAYTRIP_FLIGHT_SEARCH_RESULT: {
            return {
                ...state,
                isLoading: false,
                flightSearchResult: action.payload,
                error: null,
            };
        }
        default:
            return state;
    }
}
