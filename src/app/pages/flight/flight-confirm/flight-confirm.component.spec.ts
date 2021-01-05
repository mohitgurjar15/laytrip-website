import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightConfirmComponent } from './flight-confirm.component';

describe('FlightConfirmComponent', () => {
  let component: FlightConfirmComponent;
  let fixture: ComponentFixture<FlightConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlightConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
