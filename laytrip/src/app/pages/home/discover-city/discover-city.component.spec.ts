import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverCityComponent } from './discover-city.component';

describe('DiscoverCityComponent', () => {
  let component: DiscoverCityComponent;
  let fixture: ComponentFixture<DiscoverCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscoverCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
