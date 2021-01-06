import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModeLoaderComponent } from './payment-mode-loader.component';

describe('PaymentModeLoaderComponent', () => {
  let component: PaymentModeLoaderComponent;
  let fixture: ComponentFixture<PaymentModeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentModeLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentModeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
