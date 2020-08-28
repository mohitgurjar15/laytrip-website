import { NgModule } from '@angular/core';

import { LayTripStateService } from './services/layTripState.service';

import { StoreModule } from '@ngrx/store';
import * as fromLayTrip from './store/reducer';
import { EffectsModule } from '@ngrx/effects';
import { LayTripStateEffects } from './store/effects';
import { LayTripStateStoreService } from './layTripState-store.service';

@NgModule({
    imports: [
        StoreModule.forFeature('layTripState', fromLayTrip.reducer),
        EffectsModule.forFeature([LayTripStateEffects]),
    ],
    declarations: [],
    providers: [
        LayTripStateService,
        LayTripStateStoreService
    ]
})
export class LayTripStateStoreModule { }
