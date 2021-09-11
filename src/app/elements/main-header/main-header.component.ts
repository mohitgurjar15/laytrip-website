import { Component, OnInit, DoCheck, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { getLoginUserInfo, redirectToLogin } from '../../_helpers/jwt.helper';
import { CommonFunction } from '../../_helpers/common-function';
import { CartService } from '../../services/cart.service';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../services/user.service';
import { EmptyCartComponent } from '../../components/empty-cart/empty-cart.component';
import { AppleSecurityLoginPopupComponent } from '../../pages/user/apple-security-login-popup/apple-security-login-popup.component';
declare var $: any;
import {installmentType} from '../../_helpers/generic.helper';
import { Langunage, LangunageModel } from 'src/app/model/langunage.model';

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
  totalAmount: number = 0;
  fullPageLoading = false;
  modalRef;
  guestUserId: string = '';
  cartOverLimit;
  isOpenAppleLoginPopup = false;
  paymentType: string ='';
  instalmentType:string='weekly';
  installmentOptions;
  userLang: string = "en";
  paymentInfo;
  langunages: Langunage[] = [];
  selectedLanunage: Langunage = { id: 0, name: '', iso_1Code: '', iso_2Code: '', active: false };
  isLanunageSet: boolean = false;
  
  cartIsPromotional: boolean = false;
  constructor(
    private genericService: GenericService,
    public translate: TranslateService,
    public modalService: NgbModal,
    public router: Router,
    public commonFunction: CommonFunction,
    public cd: ChangeDetectorRef,
    private cartService: CartService,
    private cookieService: CookieService,
    private userService: UserService,
    private renderer: Renderer2,
    public route :ActivatedRoute,
    
  ) {
    let _langunage = localStorage.getItem('_lang');
    if (_langunage) {
      try {
        let _lang = JSON.parse(_langunage);
        this.selectedLanunage = _lang;
        translate.setDefaultLang(this.selectedLanunage.iso_1Code);
        this.isLanunageSet = true;
        this.renderer.addClass(document.body, `${this.selectedLanunage.iso_1Code}_lang`);
      } catch (error) {
        this.isLanunageSet = false;
        translate.setDefaultLang('en');
      }
    } else {
      translate.setDefaultLang('en');
    }
  }

  ngOnInit() {
    this.getLangunages();
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
    });

    this.countryCode = this.commonFunction.getUserCountry();

    this.cartService.getPaymentOptions.subscribe((data: any) => {
      if(Object.keys(data).length>0){
        this.paymentInfo=data;
        if (data.paymentType == 'instalment') {
          this.paymentType='instalment';
          this.instalmentType=data.instalmentType;
          this.installmentAmount=data.instalments.instalment_date[1].instalment_amount;
        }
        else{
          this.paymentType='no-instalment';
          this.instalmentType='';
        }
      } else {

        try{
          let data:any=localStorage.getItem("__pm_inf");
          data = atob(data);
          data=JSON.parse(data);
          this.paymentInfo = data;
         
          if(data.paymentType=='instalment'){
            this.paymentType='instalment';
            this.instalmentType=data.instalmentType;
            this.installmentAmount=data.instalments.instalment_date[1].instalment_amount;
          } else {
            if (this.installmentAmount > 0) {
              this.paymentType='instalment';
             } else {              
              this.paymentType='no-instalment';
              this.instalmentType='';
            }
          }
        }catch (e) {
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
          this.cartItemsCount = res.count;
          this.cartIsPromotional = res.cartIsPromotional;
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
    this.cartItemsCount = JSON.parse(localStorage.getItem('$crt'));
   /*  this.cartService.getCartItems.subscribe((res: any) => {
      try {
      }
      catch (e) {

      }
    }); */

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
    this.cartItemsCount = 0;
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
      centered: true,
      windowClass: 'share_modal',
      keyboard: false,
      // backdrop: 'static'
    });
  }

  calculateInstalment(cartPrices) {
    let totalPrice = 0; let downpayment = 0; let checkinDate;
    if (cartPrices && cartPrices.length > 0) {
      checkinDate = this.getCheckinDate(cartPrices[0].module_Info,cartPrices[0].type)
      for (let i = 0; i < cartPrices.length; i++) {
        if (this.cartIsPromotional && cartPrices[i].module_Info.offer_data.down_payment_options[0].applicable) {
          downpayment += cartPrices[i].module_Info.offer_data.down_payment_options[0].amount;
        }
        totalPrice += this.getPrice(cartPrices[i].module_Info,cartPrices[i].type);
        if (i == 0) {
          continue;
        }
        if (moment(checkinDate).isAfter(moment(this.getCheckinDate(cartPrices[i].module_Info,cartPrices[i].type)))) {
          checkinDate = this.getCheckinDate(cartPrices[i].module_Info,cartPrices[i].type);
        }
      }
    }
    this.totalAmount = totalPrice ? totalPrice : 0;
    let instalmentRequest = {
      instalment_type: this.paymentInfo.instalmentType || "weekly",
      checkin_date: checkinDate,
      booking_date: moment().format("YYYY-MM-DD"),
      amount: totalPrice,
      additional_amount: 0,
      down_payment: 0,
      selected_down_payment: this.paymentInfo.selectedDownPayment || 0,
      custom_down_payment: this.cartIsPromotional ? downpayment : 0,
      down_payment_option : [],
      is_down_payment_in_percentage: true,
    }
    let checkInDiff = moment(moment(instalmentRequest.checkin_date,'YYYY-MM-DD')).diff(moment().format("YYYY-MM-DD"),'days');
      if(checkInDiff > 30){          
        instalmentRequest.down_payment_option = [40,50,60];
      } else if(checkInDiff > 90){
        instalmentRequest.down_payment_option = [20,30,40];
      }
    this.genericService.getInstalemnts(instalmentRequest).subscribe((res: any) => {
      if (res.instalment_available) {
        this.installmentAmount = res.instalment_date[1].instalment_amount ? res.instalment_date[1].instalment_amount : 0;
        this.paymentType = 'instalment';        
      } else {
        this.installmentAmount = 0;
        this.paymentType = 'no-instalment';
      }
    }, (err) => {
      this.installmentAmount = 0;
      this.paymentType = 'no-instalment';
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
    if(type=='flight'){
      checkinDate = moment(module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
    }
    else if(type=='hotel'){
      checkinDate = moment(module_Info.input_data.check_in, "YYYY-MM-DD'").format("YYYY-MM-DD");
    }
    return checkinDate;
  }

  getPrice(module_Info,type){
    let price = 0;
    if (type == 'flight') {
      if (this.commonFunction.isRefferal() && module_Info.offer_data && module_Info.offer_data.applicable ) {        
        price = module_Info.discounted_selling_price ? module_Info.discounted_selling_price : 0;
      } else {        
        price = module_Info.selling_price ? module_Info.selling_price : 0;
      }
    }
    else if(type=='hotel'){
      if (this.commonFunction.isRefferal() && module_Info.offer_data && module_Info.offer_data.applicable) {
        price = module_Info.selling.discounted_total ? module_Info.selling.discounted_total : 0;
      } else {
        price = module_Info.selling.total ? module_Info.selling.total: 0;
      }
    }
    return price;
  }

  
  /**
  * change user lanunage
  * @param langunage 
  */
   changeLangunage(langunage: Langunage) {
    if (JSON.stringify(langunage) != JSON.stringify(this.selectedLanunage)) {
      this.selectedLanunage = langunage;
      localStorage.setItem("_lang", JSON.stringify(langunage))
      this.renderer.removeClass(document.body, `en_lang`);
      this.renderer.removeClass(document.body, `es_lang`);
      this.renderer.removeClass(document.body, `it_lang`);
      this.translate.use(langunage.iso_1Code);
      this.renderer.addClass(document.body, `${this.selectedLanunage.iso_1Code}_lang`);
      // const urlParameters = Object.assign({}, this.route.snapshot.queryParams); 
      // urlParameters.lang = this.selectedLanunage.iso_1Code;

      // this.router.navigate([], { relativeTo: this.route, queryParams: urlParameters });
    }
  }

  /**
   * Get all langunages
   */
  getLangunages() {
    this.genericService.getAllLangunage().subscribe(
      (response: LangunageModel) => {
        this.langunages = response.data.filter(lang => lang.active == true);
        //this.langunages = response.data.filter(lang => lang.iso_1Code == "en" || lang.iso_1Code == "es");
        if (!this.isLanunageSet) {
          this.isLanunageSet = true;
          this.selectedLanunage = this.langunages[0];
          localStorage.setItem("_lang", JSON.stringify(this.langunages[0]));

          // Author: xavier | 2021/8/24
          // Description: Get language from browser
          const bl: string = this.translate.getBrowserLang();
          for(let i: number = 0; i < this.langunages.length; i++) {
            if(this.langunages[i].iso_1Code == bl) {
              // Small delay to allow all components to load before changing the language
              setTimeout(() => this.changeLangunage(this.langunages[i]), 500);
              break;
            }
          }
        }
        else {
          let find = this.langunages.find(langunage => langunage.id == this.selectedLanunage.id)
          if (!find) {
            this.isLanunageSet = true;
            this.selectedLanunage = this.langunages[0];
            localStorage.setItem("_lang", JSON.stringify(this.langunages[0]))
          }
        }

        // Author: xavier | 2021/7/28
        // Description: To support localized installment types
        this.userLang = JSON.parse(localStorage.getItem('_lang')).iso_1Code;
      },
      (error) => {

      }
    )
  }

}
