import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserBenefitComponent } from './user-benefit.component';

describe('UserBenefitComponent', () => {
  let component: UserBenefitComponent;
  let fixture: ComponentFixture<UserBenefitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBenefitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserBenefitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
