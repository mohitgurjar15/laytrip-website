import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAndSubscribeComponent } from './mobile-and-subscribe.component';

describe('MobileAndSubscribeComponent', () => {
  let component: MobileAndSubscribeComponent;
  let fixture: ComponentFixture<MobileAndSubscribeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MobileAndSubscribeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAndSubscribeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
