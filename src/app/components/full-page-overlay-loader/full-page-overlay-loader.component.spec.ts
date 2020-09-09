import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullPageOverlayLoaderComponent } from './full-page-overlay-loader.component';

describe('FullPageOverlayLoaderComponent', () => {
  let component: FullPageOverlayLoaderComponent;
  let fixture: ComponentFixture<FullPageOverlayLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullPageOverlayLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullPageOverlayLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
