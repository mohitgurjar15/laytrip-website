import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsteriskMarkComponent } from './asterisk-mark.component';

describe('AsteriskMarkComponent', () => {
  let component: AsteriskMarkComponent;
  let fixture: ComponentFixture<AsteriskMarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsteriskMarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsteriskMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
