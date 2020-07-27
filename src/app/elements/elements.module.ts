import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { SecondaryFooterComponent } from './secondary-footer/secondary-footer.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [SecondaryFooterComponent],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports:[
  ]
})
export class ElementsModule { }
