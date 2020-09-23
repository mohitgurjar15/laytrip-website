import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemLaycreditComponent } from './redeem-laycredit.component';

describe('RedeemLaycreditComponent', () => {
  let component: RedeemLaycreditComponent;
  let fixture: ComponentFixture<RedeemLaycreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemLaycreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemLaycreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
