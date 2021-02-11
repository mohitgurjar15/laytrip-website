import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
declare var $: any;
import { environment } from '../../../../environments/environment';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { GenericService } from '../../../services/generic.service';
import { TravelerService } from '../../../services/traveler.service';
import { CheckOutService } from '../../../services/checkout.service';
import { CartService } from '../../../services/cart.service';
import { FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';

export interface CartItem {

  type: string;
  module_info: {},
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  progressStep = { step1: false, step2: true, step3: false, step4: false };
  userInfo;
  isShowPaymentOption: boolean = true;
  laycreditpoints: number = 0;
  sellingPrice: number;
  flightSummary = [];
  instalmentMode = 'instalment';
  instalmentType: string = 'weekly';
  isLoggedIn: boolean = false;
  priceData = [];
  priceSummary: any;
  carts = [];
  isValidData: boolean = false;
  cartLoading = false;
  loading: boolean = false;
  isCartEmpty: boolean = false;
  cartPrices = [];
  travelerForm: FormGroup;
  cardToken: string = '';

  constructor(
    private genericService: GenericService,
    private travelerService: TravelerService,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private cookieService: CookieService,
    private cd: ChangeDetectorRef
  ) {
    //this.totalLaycredit();
    this.getCountry();
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.userInfo = getLoginUserInfo();
    if (this.userInfo && Object.keys(this.userInfo).length > 0) {
      this.getTravelers();
    }

    this.cartLoading = true;
    this.cartService.getCartList('yes').subscribe((items: any) => {
      this.cartLoading = false;
      let notAvilableItems = [];
      let cart: any;
      let price: any;
      for (let i = 0; i < items.data.length; i++) {
        cart = {};
        cart.type = items.data[i].type;
        cart.module_info = items.data[i].moduleInfo[0];
        cart.old_module_info = {
          selling_price: items.data[i].oldModuleInfo[0].selling_price
        };
        cart.travelers = items.data[i].travelers;
        cart.id = items.data[i].id;
        this.carts.push(cart);
        this.cd.detectChanges();

        price = {}
        price.selling_price = items.data[i].moduleInfo[0].selling_price;
        price.departure_date = items.data[i].moduleInfo[0].departure_date;
        price.start_price = items.data[i].moduleInfo[0].start_price;
        price.location = `${items.data[i].moduleInfo[0].departure_code}-${items.data[i].moduleInfo[0].arrival_code}`
        this.cartPrices.push(price)
        if (items.data[i].is_available) {


        }
        else {
          notAvilableItems.push(items.data[i])
        }
      }
      this.cartService.setCartPrices(this.cartPrices);
      this.cd.detectChanges();
      if (notAvilableItems.length) {
        // this.toastrService.warning(`${notAvilableItems.length} itinerary is not available`);
      }

      this.checkOutService.getPriceSummary.subscribe((data: any) => {
        if (data) {
          this.priceSummary = data;
          this.cd.detectChanges();
        }
      });
    }, error => {
      this.isCartEmpty = true;
      this.cartLoading = false;
    });

    this.cartService.getCartId.subscribe(cartId => {
      if (cartId > 0) {
        this.deleteCart(cartId);
        this.cartService.setCardId(0);
      }
    })

    this.checkOutService.getTravelerFormData.subscribe((travelerFrom: any) => {
      this.isValidData = travelerFrom.status === 'VALID' ? true : false;
      this.travelerForm = travelerFrom;
    })

    try {
      this.cardToken = this.cookieService.get('__cc');
      this.cd.detectChanges();
    }
    catch (e) {
      this.cardToken = '';
    }

  }

  getTravelers() {
    this.travelerService.getTravelers().subscribe((res: any) => {
      this.checkOutService.setTravelers(res.data);
      this.cd.detectChanges();
    })
  }

  getCountry() {
    this.genericService.getCountry().subscribe(res => {
      this.checkOutService.setCountries(res);
    })
  }

  ngOnDestroy() {
    this.cartService.setCartTravelers({
      type0: {
        adults: []
      },
      type1: {
        adults: []
      },
      type2: {
        adults: []
      },
      type3: {
        adults: []
      },
      type4: {
        adults: []
      }
    });
  }

  deleteCart(cartId) {
    this.loading = true;
    this.cartService.deleteCartItem(cartId).subscribe((res: any) => {
      this.loading = false;
      let index = this.carts.findIndex(x => x.id == cartId);
      this.carts.splice(index, 1);
      this.cartPrices.splice(index, 1)
      this.cartService.setCartItems(this.carts);
      this.cartService.setCartPrices(this.cartPrices)
      if (this.carts.length == 0) {
        this.isCartEmpty = true;
      }
      localStorage.setItem('$crt', JSON.stringify(this.carts.length));
    }, error => {
      this.loading = false;
      if (error.status == 404) {
        let index = this.carts.findIndex(x => x.id == cartId);
        this.carts.splice(index, 1);
        this.cartService.setCartItems(this.carts);
        if (this.carts.length == 0) {
          this.isCartEmpty = true;
        }
        localStorage.setItem('$crt', JSON.stringify(this.carts.length));
      }
    });
  }



}
