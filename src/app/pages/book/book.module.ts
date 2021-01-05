import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book/book.component';
import { BookRoutingModule } from './book-routing.module';
import { ConfirmComponent } from './confirm/confirm.component';
import { FailureComponent } from './failure/failure.component';



@NgModule({
  declarations: [BookComponent, ConfirmComponent, FailureComponent],
  imports: [
    CommonModule,
    BookRoutingModule
  ]
})
export class BookModule { }
