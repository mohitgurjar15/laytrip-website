import { NgModule } from '@angular/core';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { LayTripStoreModule } from './layTrip/layTrip-store.module';

const metaReducers: Array<MetaReducer<any, any>> = [];

@NgModule({
    imports: [
        LayTripStoreModule,
        StoreModule.forRoot({ router: routerReducer }, { metaReducers }),
        EffectsModule.forRoot([]),
        StoreRouterConnectingModule.forRoot({ stateKey: 'router' })
    ],
    declarations: [],
})
export class StateModule { }
