import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book/book.component';
import { BookRoutingModule } from './book-routing.module';
import { ConfirmComponent } from './confirm/confirm.component';
import { FailureComponent } from './failure/failure.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { ChallengeComponent } from './challenge/challenge.component';



@NgModule({
  declarations: [BookComponent, ConfirmComponent, FailureComponent, PurchaseComponent, ChallengeComponent],
  imports: [
    CommonModule,
    BookRoutingModule
  ],exports: [ChallengeComponent]
})
export class BookModule { }
