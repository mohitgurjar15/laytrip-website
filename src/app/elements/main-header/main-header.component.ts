import { Component, OnInit, DoCheck, Renderer2, ChangeDetectorRef, Output } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { environment } from '../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { getLoginUserInfo, redirectToLogin } from '../../_helpers/jwt.helper';
import { CommonFunction } from '../../_helpers/common-function';
import { CartService } from '../../services/cart.service';
import * as moment from 'moment';

declare var $: any;

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
  weeklyInstallmentAmount: number;
  totalAmount: number;
  fullPageLoading = false;
  modalRef;

  constructor(
    private genericService: GenericService,
    public translate: TranslateService,
    public modalService: NgbModal,
    public router: Router,
    private commonFunction: CommonFunction,
    private renderer: Renderer2,
    public cd: ChangeDetectorRef,
    private cartService: CartService,
  ) {
  }

  ngOnInit(): void {
    this.checkUser();
    this.loadJquery();
    //this.getUserLocationInfo();
    if (this.isLoggedIn) {
      if (this.userDetails.roleId != 7) {
        this.totalLaycredit();
        this.getCartList();
      }
    }

    this.cartService.getCartItems.subscribe(data => {

      if (data.length > 0) {
        //console.log(data, "getCartItems.subscribe")
        //this.calculateInstalment(data)
        //this.getCartList();
        this.updateCartSummary()
      }
    })
    this.countryCode = this.commonFunction.getUserCountry();
  }

  getCartList() {
    if (this.isLoggedIn) {
      // GET CART LIST FROM GENERIC SERVICE
      this.cartService.getCartList().subscribe((res: any) => {
        if (res) {
          // SET CART ITEMS IN CART SERVICE
          let cartItems = res.data.map(item => { return { id: item.id, module_Info: item.moduleInfo[0] } });
          this.cartService.setCartItems(cartItems);
          if (cartItems) {
            this.cartItemsCount = res.count;
            localStorage.setItem('$crt', this.cartItemsCount);
          }
          this.calculateInstalment(cartItems);
          this.cd.detectChanges();
        }
      }, (error) => {
        if (error && error.status === 404) {
          this.cartItems = [];
          this.cartItemsCount = 0;
          localStorage.setItem('$crt', this.cartItemsCount);
        }
      });
    }
  }

  updateCartSummary(){
    if (this.isLoggedIn) {
      // GET CART LIST FROM GENERIC SERVICE
      this.cartService.getCartList().subscribe((res: any) => {
        if (res) {
          // SET CART ITEMS IN CART SERVICE
          let cartItems = res.data.map(item => { return { id: item.id, module_Info: item.moduleInfo[0] } });
          this.calculateInstalment(cartItems);
          this.cd.detectChanges();
        }
      }, (error) => {
        if (error && error.status === 404) {
          
        }
      });
    }
  }

  ngDoCheck() {
    this.checkUser();
    let host = window.location.href;
    this.isCovidPage = true;
    if (host.includes("covid-19")) {
      this.isCovidPage = false;
      this.cd.detectChanges();
    }
    this.cartService.getCartItems.subscribe((res: any) => {
      try {
        this.cartItemsCount = JSON.parse(localStorage.getItem('$crt'));
      }
      catch (e) {

      }
    });
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
      var name = this.userDetails.email.substring(0, this.userDetails.email.lastIndexOf("@"));
      var domain = this.userDetails.email.substring(this.userDetails.email.lastIndexOf("@") + 1);
      this.username = this.userDetails.firstName ? this.userDetails.firstName : name;
      if (this.userDetails.roleId != 7 && !this._isLayCredit) {
        this.totalLaycredit();
        this.getCartList();
      }
      this.showTotalLayCredit = this.totalLayCredit;
    }
  }

  onLoggedout() {
    this.isLoggedIn = this._isLayCredit = false;
    this.showTotalLayCredit = 0;
    localStorage.removeItem('_lay_sess');
    localStorage.removeItem('$crt');
    this.cartItemsCount = '';
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
    $('#sign_in_modal').modal('show');
    $("#signin-form").trigger("reset");
  }

  redirectToPayment() {
    /* if (this.isLoggedIn && this.cartItemsCount > 0) {
    } */
    this.router.navigate([`cart/booking`]);
  }

  calculateInstalment(cartPrices) {
    let totalPrice = 0;
    let checkinDate;
    //console.log('cartprices:::::', cartPrices);
    if (cartPrices && cartPrices.length > 0) {
      
        checkinDate = moment(cartPrices[0].module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
        for (let i = 0; i < cartPrices.length; i++) {
          totalPrice += cartPrices[i].module_Info.selling_price;
          if (i == 0) {
            continue;
          }
          if (moment(checkinDate).isAfter(moment(cartPrices[i].module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD"))) {
            checkinDate = moment(cartPrices[i].module_Info.departure_date, "DD/MM/YYYY'").format("YYYY-MM-DD");
          }
        }
    }

    //console.log(cartPrices,"Before If")
    /* if(cartPrices && cartPrices.length>0)
    {
      console.log(cartPrices,"Before sort")
      cartPrices.sort(function(a:any,b:any){
        a = new Date(a.module_Info.departure_date);
        b = new Date(b.module_Info.departure_date);
        return a-b;
      });
      let item=cartPrices.find((x,i)=>{ return i==0})
      checkinDate = item && item.module_Info ? moment(item.module_Info.departure_date,"DD/MM/YYYY").format("YYYY-MM-DD"):'2021-10-01';
      console.log(cartPrices,"After sort",checkinDate)

      for(let cartPrice of cartPrices)
      {
        totalPrice +=cartPrice.module_Info.selling_price;
      }
    }
    console.log(totalPrice,"totalPrice") */

    this.totalAmount = totalPrice;
    let instalmentRequest = {
      instalment_type: "weekly",
      checkin_date: checkinDate,
      booking_date: moment().format("YYYY-MM-DD"),
      amount: totalPrice,
      additional_amount: 0,
      selected_down_payment: 0
    }
    this.genericService.getInstalemnts(instalmentRequest).subscribe((res: any) => {
      if (res.instalment_available) {
        this.weeklyInstallmentAmount = res.instalment_date[1].instalment_amount;
      }
      else {
        this.weeklyInstallmentAmount = 0;
      }
    }, (err) => {
      this.weeklyInstallmentAmount = 0;
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
    this.router.navigate(['/']);
  }
}
