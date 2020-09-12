import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingEnquiryInfoComponent } from './booking-enquiry-info.component';

describe('BookingEnquiryInfoComponent', () => {
  let component: BookingEnquiryInfoComponent;
  let fixture: ComponentFixture<BookingEnquiryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingEnquiryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingEnquiryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
