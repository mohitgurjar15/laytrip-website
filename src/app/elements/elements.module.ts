import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopHeaderComponent } from './top-header/top-header.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainFooterComponent } from './main-footer/main-footer.component';
import { SecondaryFooterComponent } from './secondary-footer/secondary-footer.component';



@NgModule({
  declarations: [TopHeaderComponent, MainHeaderComponent, MainFooterComponent, SecondaryFooterComponent],
  imports: [
    CommonModule
  ]
})
export class ElementsModule { }
