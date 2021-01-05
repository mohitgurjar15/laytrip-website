import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightFailureComponent } from './flight-failure.component';

describe('FlightFailureComponent', () => {
  let component: FlightFailureComponent;
  let fixture: ComponentFixture<FlightFailureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightFailureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
