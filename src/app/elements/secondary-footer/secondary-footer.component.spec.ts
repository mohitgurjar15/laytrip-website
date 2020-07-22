import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryFooterComponent } from './secondary-footer.component';

describe('SecondaryFooterComponent', () => {
  let component: SecondaryFooterComponent;
  let fixture: ComponentFixture<SecondaryFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
