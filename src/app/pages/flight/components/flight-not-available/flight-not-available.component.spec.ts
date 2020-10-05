import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightNotAvailableComponent } from './flight-not-available.component';

describe('FlightNotAvailableComponent', () => {
  let component: FlightNotAvailableComponent;
  let fixture: ComponentFixture<FlightNotAvailableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightNotAvailableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightNotAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
