import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book/book.component';
import { BookRoutingModule } from './book-routing.module';
import { FailureComponent } from './failure/failure.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { ComponentsModule } from '../../components/components.module';



@NgModule({
  declarations: [BookComponent, FailureComponent, ChallengeComponent],
  imports: [
    CommonModule,
    BookRoutingModule,
    ComponentsModule
  ],exports: [ChallengeComponent]
})
export class BookModule { }
