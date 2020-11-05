import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeemLaycreditLoaderComponent } from './redeem-laycredit-loader.component';

describe('RedeemLaycreditLoaderComponent', () => {
  let component: RedeemLaycreditLoaderComponent;
  let fixture: ComponentFixture<RedeemLaycreditLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeemLaycreditLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeemLaycreditLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
