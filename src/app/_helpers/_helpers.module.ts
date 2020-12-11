import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// DIRECTIVES
import { ClickOutSideDirective } from './clickOutSide.directive';

@NgModule({
  declarations: [ClickOutSideDirective],
  imports: [
    CommonModule
  ],
  exports: [ClickOutSideDirective]
})
export class HelpersModule { }
