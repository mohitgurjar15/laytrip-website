import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryFooterComponent } from './secondary-footer/secondary-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { PagesModule } from '../pages/pages.module';



@NgModule({
  declarations: [SecondaryFooterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PagesModule
  ],
  exports:[
  ]
})
export class ElementsModule { }
