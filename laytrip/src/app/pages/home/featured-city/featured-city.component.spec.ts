import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedCityComponent } from './featured-city.component';

describe('FeaturedCityComponent', () => {
  let component: FeaturedCityComponent;
  let fixture: ComponentFixture<FeaturedCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeaturedCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
