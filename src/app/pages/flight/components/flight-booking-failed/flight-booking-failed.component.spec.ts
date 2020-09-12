import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightBookingFailedComponent } from './flight-booking-failed.component';

describe('FlightBookingFailedComponent', () => {
  let component: FlightBookingFailedComponent;
  let fixture: ComponentFixture<FlightBookingFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightBookingFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightBookingFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
