import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightClassComponent } from './flight-class.component';

describe('FlightClassComponent', () => {
  let component: FlightClassComponent;
  let fixture: ComponentFixture<FlightClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlightClassComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlightClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
