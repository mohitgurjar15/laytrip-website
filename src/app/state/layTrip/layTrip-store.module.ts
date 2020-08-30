import { NgModule } from '@angular/core';

import { LayTripService } from './services/layTrip.service';

import { StoreModule, MetaReducer } from '@ngrx/store';
import * as fromLayTrip from './store/reducer';
import { EffectsModule } from '@ngrx/effects';
import { LayTripEffects } from './store/effects';
import { LayTripStoreService } from './layTrip-store.service';
import { Interceptor } from './interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const metaReducers: Array<MetaReducer<any, any>> = [];

@NgModule({
    imports: [
        StoreModule.forFeature('layTrip', fromLayTrip.reducer, { metaReducers }),
        EffectsModule.forFeature([LayTripEffects]),
    ],
    declarations: [],
    providers: [
        LayTripService,
        LayTripStoreService,
        Interceptor, { provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }
    ]
})
export class LayTripStoreModule { }
