import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HotelRoutingModule } from './hotel-routing.module';
import { HotelSearchComponent } from './hotel-search/hotel-search.component';
import { HotelLoaderComponent } from './components/hotel-loader/hotel-loader.component';
import { HotelPopupLoaderComponent } from './components/hotel-popup-loader/hotel-popup-loader.component';
import { HotelNotFoundComponent } from './components/hotel-not-found/hotel-not-found.component';
import { HotelErrorComponent } from './components/hotel-error/hotel-error.component';
import { SortHotelComponent } from './components/sort-hotel/sort-hotel.component';
import { FilterHotelComponent } from './components/filter-hotel/filter-hotel.component';
import { HotelItemWrapperComponent } from './components/hotel-item-wrapper/hotel-item-wrapper.component';
import { HotelSearchBarComponent } from './components/hotel-search-bar/hotel-search-bar.component';
import { HotelDetailComponent } from './components/hotel-detail/hotel-detail.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ComponentsModule } from '../../components/components.module';
// import { ClickOutSideDirective } from '../../_helpers/clickOutSide.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CookieModule } from 'ngx-cookie';
import { CalendarModule } from 'primeng/calendar';
// // AGM (ANGULAR GOOGLE MAP)
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

// NGX-GALLERY
import { NgxGalleryModule } from 'ngx-gallery';

// HELPERS MODULE
import { HelpersModule } from '../../_helpers/_helpers.module';

@NgModule({
  declarations: [
    HotelSearchComponent,
    HotelLoaderComponent,
    HotelPopupLoaderComponent,
    HotelNotFoundComponent,
    HotelErrorComponent,
    SortHotelComponent,
    FilterHotelComponent,
    HotelItemWrapperComponent,
    HotelSearchBarComponent,
    // ClickOutSideDirective,
    HotelDetailComponent,
  ],
  imports: [
    CommonModule,
    HotelRoutingModule,
    Ng5SliderModule,
    HelpersModule,
    ComponentsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    CookieModule.forRoot(),
    CalendarModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyB63siq6uISCHD-x3MkitGQogoz8n7jy7M',
      apiKey: 'AIzaSyB7Ws9zJ9ozVruSjF2N3pDVsqHF-h1QtBU',
      libraries: ['places']
    }),
    NgxGalleryModule,
  ],
  exports: [
    HotelLoaderComponent,
    HotelPopupLoaderComponent,
    HotelNotFoundComponent,
  ],
})
export class HotelModule { }
