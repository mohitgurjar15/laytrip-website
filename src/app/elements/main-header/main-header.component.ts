import { Component, OnInit, DoCheck, ViewChild, Renderer2, ChangeDetectorRef } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { LangunageModel, Langunage } from '../../model/langunage.model';
import { environment } from '../../../environments/environment';
import { Currency, CurrencyModel } from '../../model/currency.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { getLoginUserInfo, redirectToLogin } from '../../_helpers/jwt.helper';
import { AuthComponent } from '../../pages/user/auth/auth.component';
import { CommonFunction } from '../../_helpers/common-function';
declare var $: any;

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, DoCheck {

  @ViewChild(MainHeaderComponent, { static: false }) headerComponent: MainHeaderComponent;

  s3BucketUrl = environment.s3BucketUrl;
  defaultImage = this.s3BucketUrl + 'assets/images/profile_laytrip.svg';

  isLoggedIn = false;
  totalLayCredit = 0;
  showTotalLayCredit = 0;
  userDetails;
  username;
  _isLayCredit = false;
  countryCode: string;
  isCovidPage = true;

  constructor(
    private genericService: GenericService,
    public translate: TranslateService,
    public modalService: NgbModal,
    public router: Router,
    private commonFunction: CommonFunction,
    private renderer: Renderer2,
    public cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.checkUser();
    this.loadJquery();
    //this.getUserLocationInfo();
    if (this.isLoggedIn) {
      if (this.userDetails.roleId != 7) {
        this.totalLaycredit();
      }
    }
    this.countryCode = this.commonFunction.getUserCountry();
  }


  ngDoCheck() {
    this.checkUser();
    let host = window.location.href;
    if (host.includes("covid-19")) {
      this.isCovidPage = false;
      this.cd.detectChanges();
    }
    // this.userDetails = getLoginUserInfo();
    // this.totalLaycredit();
  }

  ngOnChanges() {
    // this.totalLaycredit();
  }

  checkUser() {
    let userToken = localStorage.getItem('_lay_sess');

    this.isLoggedIn = false;
    if (userToken && userToken != 'undefined' && userToken != 'null') {
      localStorage.removeItem("_isSubscribeNow");
      this.isLoggedIn = true;
      this.userDetails = getLoginUserInfo();
      if (this.userDetails.roleId != 7 && !this._isLayCredit) {
        this.totalLaycredit();
      }
      this.showTotalLayCredit = this.totalLayCredit;
    }
  }

  onLoggedout() {
    this.isLoggedIn = this._isLayCredit = false;
    this.showTotalLayCredit = 0;
    localStorage.removeItem('_lay_sess');
    this.router.navigate(['/']);
  }

  loadJquery() {
    // Start sticky header js
    $(document).ready(function () {
      if ($(window).width() > 992) {

        var navbar_height = $('.site_header').outerHeight();

        $(window).scroll(function () {
          if ($(this).scrollTop() > 30) {
            $('.site_header').css('height', navbar_height + 'px');
            $('.site_header').addClass("fixed-top");

          } else {
            $('.site_header').removeClass("fixed-top");
            $('.site_header').css('height', 'auto');
          }
        });
      }
    });
    // Close sticky header js
  }

  totalLaycredit() {
    this._isLayCredit = true;
    this.genericService.getAvailableLaycredit().subscribe((res: any) => {
      this.totalLayCredit = res.total_available_points;
    }, (error => {
      if (error.status == 406) {
        redirectToLogin();
      }
    }))
  }

  openSignModal() {
    // const modalRef = this.modalService.open(AuthComponent);
    // $('#sign_in_modal').modal('show');
    // $("#signin-form").trigger( "reset" );

  }
  
}
