import { Component, OnInit, DoCheck, Renderer2, ChangeDetectorRef, Output, ViewChild, SimpleChanges } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { getLoginUserInfo, redirectToLogin } from '../../_helpers/jwt.helper';
import { CommonFunction } from '../../_helpers/common-function';
import { CartService } from '../../services/cart.service';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../services/user.service';
import { EmptyCartComponent } from '../../components/empty-cart/empty-cart.component';
import { AppleSecurityLoginPopupComponent, MODAL_TYPE } from '../../pages/user/apple-security-login-popup/apple-security-login-popup.component';
declare var $: any;
import {installmentType} from '../../_helpers/generic.helper';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit, DoCheck {

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
  cartItems;
  cartItemsCount;
  installmentAmount: number;
  totalAmount: number;
  fullPageLoading = false;
  modalRef;
  guestUserId: string = '';
  cartOverLimit;
  isOpenAppleLoginPopup = false;
  paymentType:string='';
  instalmentType:string='weekly';
  installmentOptions;
  paymentInfo;

  constructor(
    private genericService: GenericService,
    public translate: TranslateService,
    public modalService: NgbModal,
    public router: Router,
    public commonFunction: CommonFunction,
    public cd: ChangeDetectorRef,
    private cartService: CartService,
    private cookieService: CookieService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.checkUser();
    this.loadJquery();
    //this.getUserLocationInfo();
    if (this.isLoggedIn) {
      this.totalLaycredit();
    }
    this.getCartList();
    this.installmentOptions=installmentType;

    this.cartService.getCartItems.subscribe(data => {
      if (data.length > 0) {
        this.updateCartSummary()
      }
    })
    this.countryCode = this.commonFunction.getUserCountry();

    this.cartService.getPaymentOptions.subscribe((data:any)=>{
      if(Object.keys(data).length>0){
        this.paymentInfo=data;
        if(data.paymentType=='instalment'){
          this.paymentType='instalment';
          this.instalmentType=data.instalmentType;
          this.installmentAmount=data.instalments.instalment_date[1].instalment_amount;
        }
        else{
          this.paymentType='no-instalment';
          this.instalmentType='';
        }
      }
      else{
        try{
          let data:any=localStorage.getItem("__pm_inf");
          data = atob(data);
          data=JSON.parse(data);
          this.paymentInfo=data;
          if(data.paymentType=='instalment'){
            this.paymentType='instalment';
            this.instalmentType=data.instalmentType;
            this.installmentAmount=data.instalments.instalment_date[1].instalment_amount;
          }
          else{
            this.paymentType='no-instalment';
            this.instalmentType='';
          }
        }
        catch(e){
          this.paymentInfo={};
        }
      }
    })
  }

  getCartList() {

    let live_availiblity = 'no';
    let url = window.location.href;
    if (url.includes('cart/checkout')) {
      live_availiblity = 'yes';
    }
    this.cartService.getCartList(live_availiblity).subscribe((res: any) => {
      if (res) {
        // SET CART ITEMS IN CART SERVICE
        let cartItems = res.data.map(item => { return { id: item.id, module_Info: item.moduleInfo[0], type : item.type } });
        this.cartItems = cartItems;
        this.cartService.setCartItems(cartItems);
        if (cartItems) {
          this.cartItemsCount = res.data.length;
          localStorage.setItem('$crt', this.cartItemsCount);
        }
        this.calculateInstalment(cartItems);
        // this.cd.detectChanges();
      }
    }, (error) => {
      if (error && error.status === 404) {
        this.cartItems = [];
        this.cartItemsCount = 0;
        localStorage.setItem('$crt', this.cartItemsCount);
      }
    });
  }

  updateCartSummary() {
    let live_availiblity = 'no';
    let url = window.location.href;
    if (url.includes('cart/checkout')) {
      live_availiblity = 'yes';
    }
    this.cartService.getCartList(live_availiblity).subscribe((res: any) => {
      if (res) {
        // SET CART ITEMS IN CART SERVICE
        let cartItems = res.data.map(item => { 
          return { id: item.id, module_Info: item.moduleInfo[0],type : item.type } 
        });
        this.calculateInstalment(cartItems);
        this.cd.detectChanges();
      }
    }, (error) => {
      if (error && error.status === 404) {

      }
    });
  }

  ngDoCheck() {
    this.checkUser();
    this.cartOverLimit = JSON.parse(localStorage.getItem('$cartOver'));
    this.cd.detectChanges();
    let host = window.location.href;
    this.isCovidPage = true;
    if (host.includes("covid-19")) {
      this.isCovidPage = false;
    }
    this.cartService.getCartItems.subscribe((res: any) => {
      try {
        this.cartItemsCount = JSON.parse(localStorage.getItem('$crt'));
      }
      catch (e) {

      }
    });

  }

  checkUser() {
    this.userDetails = getLoginUserInfo();
    this.isLoggedIn = false;
    if (Object.keys(this.userDetails).length && this.userDetails.roleId != 7) {
      localStorage.removeItem("_isSubscribeNow");
      this.isLoggedIn = true;
      if (typeof this.userDetails.email != 'undefined' && this.userDetails.email != '') {
        var name = this.userDetails.email.substring(0, this.userDetails.email.lastIndexOf("@"));
        var domain = this.userDetails.email.substring(this.userDetails.email.lastIndexOf("@") + 1);
      }
      this.username = this.userDetails.firstName ? this.userDetails.firstName : name;
      if (!this._isLayCredit) {
        this.totalLaycredit();
        this.getCartList();
      }

      this.showTotalLayCredit = this.totalLayCredit;
      if (this.userDetails && this.userDetails.requireToupdate) {
        if (!this.isOpenAppleLoginPopup) {
          this.openAppleSecurityLogin();
          this.isOpenAppleLoginPopup = true;
        }
      }
    }
  }

  openAppleSecurityLogin() {
    const modalRef = this.modalService.open(AppleSecurityLoginPopupComponent, {
      windowClass: 'apple_security_login_block', centered: true, backdrop: 'static',
      keyboard: false
    }).result.then((result) => {
      
    });
  }


  onLoggedout() {
    this.isLoggedIn = this._isLayCredit = false;
    this.showTotalLayCredit = 0;
    localStorage.removeItem('_lay_sess');
    localStorage.removeItem('$crt');
    localStorage.removeItem('$cartOver');
    this.cookieService.remove('__cc');
    this.cartItemsCount = '';
    this.cartService.setCartItems([]);
    this.loginGuestUser();
    if(this.commonFunction.isRefferal()){
      var parms = this.commonFunction.getRefferalParms();
      var queryParams: any = {};
      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if(parms.utm_medium){
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if(parms.utm_campaign){
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
      this.router.navigate([`/`],{ queryParams : queryParams});
    } else {
      this.router.navigate(['/']);
    }
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
    $('#sign_in_modal').modal('show');
    $("#signin-form").trigger("reset");
  }

  redirectToPayment() {
    this.cartItemsCount = JSON.parse(localStorage.getItem('$crt')) || 0;
    if (this.cartItemsCount > 0) {
      if(this.commonFunction.isRefferal()){
        var parms = this.commonFunction.getRefferalParms();
        var queryParams: any = {};
        queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
        if(parms.utm_medium){
          queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
        }
        if(parms.utm_campaign){
          queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
        }
        this.router.navigate([`cart/checkout`],{ queryParams : queryParams});
      } else {
        this.router.navigate([`cart/checkout`]);
      }
    } else {
      this.openEmptyCartPopup();
    }
  }

  openEmptyCartPopup() {
    this.modalService.open(EmptyCartComponent, {
      centered: true, backdrop: 'static',
      keyboard: false
    });
  }

  calculateInstalment(cartPrices) {
    let totalPrice = 0;
    let checkinDate;
    if (cartPrices && cartPrices.length > 0) {
      checkinDate = this.getCheckinDate(cartPrices[0].module_Info,cartPrices[0].type)
      for (let i = 0; i < cartPrices.length; i++) {
        totalPrice += this.getPrice(cartPrices[i].module_Info,cartPrices[i].type);
        if (i == 0) {
          continue;
        }
        if (moment(checkinDate).isAfter(moment(this.getCheckinDate(cartPrices[i].module_Info,cartPrices[i].type)))) {
          checkinDate = this.getCheckinDate(cartPrices[i].module_Info,cartPrices[i].type);
        }
      }
    }

    this.totalAmount = totalPrice;
    let instalmentRequest = {
      instalment_type: this.paymentInfo.instalmentType || "weekly",
      checkin_date: checkinDate,
      booking_date: moment().format("YYYY-MM-DD"),
      amount: totalPrice,
      additional_amount: 0,
      selected_down_payment: this.paymentInfo.selectedDownPayment || 0
    }
    this.genericService.getInstalemnts(instalmentRequest).subscribe((res: any) => {
      if (res.instalment_available) {
        this.installmentAmount = res.instalment_date[1].instalment_amount;
      }
      else {
        this.installmentAmount = 0;
      }
    }, (err) => {
      this.installmentAmount = 0;
    })
  }

  emptyCart() {
    $('#empty_modal').modal('hide');
    this.fullPageLoading = true;

    this.genericService.emptyCart().subscribe((res: any) => {
      if (res) {
        this.fullPageLoading = false;
        this.cartItems = [];
        this.cartItemsCount = 0;
        localStorage.setItem('$crt', this.cartItemsCount);
        localStorage.removeItem('$cartOver');
        this.cartService.setCartItems(this.cartItems);
        this.redirectToHome();
      }
    });
  }

  closeModal() {
    $('#empty_modal').modal('hide');
  }

  redirectToHome() {
    $('#empty_modal').modal('hide');
    if(this.commonFunction.isRefferal()){
      var parms = this.commonFunction.getRefferalParms();
      var queryParams: any = {};
      queryParams.utm_source = parms.utm_source ? parms.utm_source : '';
      if(parms.utm_medium){
        queryParams.utm_medium = parms.utm_medium ? parms.utm_medium : '';
      }
      if(parms.utm_campaign){
        queryParams.utm_campaign = parms.utm_campaign ? parms.utm_campaign : '';
      }
      this.router.navigate([`/`],{ queryParams : queryParams});
    } else {
      this.router.navigate(['/']);
    }
  }

  loginGuestUser() {
    let uuid = localStorage.getItem('__gst')
    this.userService.registerGuestUser({ guest_id: uuid }).subscribe((result: any) => {
      localStorage.setItem("_lay_sess", result.accessToken)
    })
  }

  closeCartMaximum() {
    localStorage.removeItem('$cartOver');
  }

  imgError() {
    return  this.userDetails.profilePic = '';
  }

  getCheckinDate(module_Info,type){
    let checkinDate;
    //console.log(module_Info)
    if(type=='flight'){
      checkinDate = moment(module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
    }
    else if(type=='hotel'){
      checkinDate = moment(module_Info.input_data.check_in, "YYYY-MM-DD'").format("YYYY-MM-DD");
    }
    return checkinDate;
  }

  getPrice(module_Info,type){
    let price;
    if(type=='flight'){
      price = module_Info.selling_price;
    }
    else if(type=='hotel'){
      price = module_Info.selling.total;
    }
    return price;
  }
}
