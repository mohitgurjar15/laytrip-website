import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialPaymentComponent } from './partial-payment.component';

describe('PartialPaymentComponent', () => {
  let component: PartialPaymentComponent;
  let fixture: ComponentFixture<PartialPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartialPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
