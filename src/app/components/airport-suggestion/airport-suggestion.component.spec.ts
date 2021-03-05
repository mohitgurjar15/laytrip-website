import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirportSuggestionComponent } from './airport-suggestion.component';

describe('AirportSuggestionComponent', () => {
  let component: AirportSuggestionComponent;
  let fixture: ComponentFixture<AirportSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirportSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirportSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
