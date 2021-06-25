import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountedBookingAlertComponent } from './discounted-booking-alert.component';

describe('DiscountedBookingAlertComponent', () => {
  let component: DiscountedBookingAlertComponent;
  let fixture: ComponentFixture<DiscountedBookingAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountedBookingAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountedBookingAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
