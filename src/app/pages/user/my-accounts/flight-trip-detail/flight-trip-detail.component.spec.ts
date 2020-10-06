import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightTripDetailComponent } from './flight-trip-detail.component';

describe('FlightTripDetailComponent', () => {
  let component: FlightTripDetailComponent;
  let fixture: ComponentFixture<FlightTripDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightTripDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightTripDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
