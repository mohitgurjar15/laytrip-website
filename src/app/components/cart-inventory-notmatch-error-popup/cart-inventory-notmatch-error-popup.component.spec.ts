import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CartInventoryNotmatchErrorPopupComponent } from './cart-inventory-notmatch-error-popup.component';

describe('CartInventoryNotmatchErrorPopupComponent', () => {
  let component: CartInventoryNotmatchErrorPopupComponent;
  let fixture: ComponentFixture<CartInventoryNotmatchErrorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartInventoryNotmatchErrorPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartInventoryNotmatchErrorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
