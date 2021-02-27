import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCompletionErrorPopupComponent } from './booking-completion-error-popup.component';

describe('BookingCompletionErrorPopupComponent', () => {
  let component: BookingCompletionErrorPopupComponent;
  let fixture: ComponentFixture<BookingCompletionErrorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingCompletionErrorPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingCompletionErrorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
