import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalContainerBaseClassComponent } from './modal-container-base-class.component';

describe('ModalContainerBaseClassComponent', () => {
  let component: ModalContainerBaseClassComponent;
  let fixture: ComponentFixture<ModalContainerBaseClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalContainerBaseClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalContainerBaseClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
