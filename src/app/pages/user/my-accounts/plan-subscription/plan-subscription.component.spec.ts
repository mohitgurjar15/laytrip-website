import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSubscriptionComponent } from './plan-subscription.component';

describe('PlanSubscriptionComponent', () => {
  let component: PlanSubscriptionComponent;
  let fixture: ComponentFixture<PlanSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanSubscriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
