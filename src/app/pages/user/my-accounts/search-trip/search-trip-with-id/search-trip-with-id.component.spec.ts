import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTripWithIdComponent } from './search-trip-with-id.component';

describe('SearchTripWithIdComponent', () => {
  let component: SearchTripWithIdComponent;
  let fixture: ComponentFixture<SearchTripWithIdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchTripWithIdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchTripWithIdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
