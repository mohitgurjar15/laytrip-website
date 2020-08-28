import { Action } from '@ngrx/store';

export enum ActionTypes {
    // Laytrip Actions
    LOAD_LAYTRIP_FLIGHT_SEARCH_RESULT = '[Laytrip] Laytrip Flight Search Result Load',
    SUCCESS_LAYTRIP_FLIGHT_SEARCH_RESULT = '[Laytrip] Laytrip Flight Search Result Load Success',

    FAILURE = '[Laytrip] Failure',
}

export class LoadLaytripFlightSearchResultAction implements Action {
    readonly type = ActionTypes.LOAD_LAYTRIP_FLIGHT_SEARCH_RESULT;
    constructor(public payload: any) { }
}

export class SuccessLaytripFlightSearchResultAction implements Action {
    readonly type = ActionTypes.SUCCESS_LAYTRIP_FLIGHT_SEARCH_RESULT;
    constructor(public payload: any) { }
}

export class FailureAction implements Action {
    readonly type = ActionTypes.FAILURE;
    constructor(public payload: { type: string, error: string }) { }
}

export type Actions =
    LoadLaytripFlightSearchResultAction | SuccessLaytripFlightSearchResultAction
    | FailureAction;

