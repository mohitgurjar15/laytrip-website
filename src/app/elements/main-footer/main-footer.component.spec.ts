import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from '../../pages/user/auth/auth.component';
import { MainFooterComponent } from './main-footer.component';
declare var $: any;

describe('MainFooterComponent', () => {
  let component: MainFooterComponent;
  let fixture: ComponentFixture<MainFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFooterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  openSignModal() {
    const modalRef = this.modalService.open(AuthComponent);
    $('#contact_modal').modal('show');
  }
});
