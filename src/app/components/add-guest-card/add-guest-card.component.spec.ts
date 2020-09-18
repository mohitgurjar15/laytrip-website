import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGuestCardComponent } from './add-guest-card.component';

describe('AddGuestCardComponent', () => {
  let component: AddGuestCardComponent;
  let fixture: ComponentFixture<AddGuestCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddGuestCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddGuestCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
