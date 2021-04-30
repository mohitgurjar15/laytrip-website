import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SecondaryFooterComponent } from './secondary-footer/secondary-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { PagesModule } from '../pages/pages.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShareSocialMediaComponent } from '../components/share-social-media/share-social-media.component';



@NgModule({
  declarations: [SecondaryFooterComponent],
  imports: [
    CommonModule,
    TranslateModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
  ],
  exports:[
  ],
  entryComponents:[ShareSocialMediaComponent]
})
export class ElementsModule { }
