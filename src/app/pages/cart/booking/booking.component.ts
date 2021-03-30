import { Component, OnInit, ViewChild } from '@angular/core';
declare var $: any;
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getLoginUserInfo } from '../../../_helpers/jwt.helper';
import { FlightService } from '../../../services/flight.service';
import * as moment from 'moment';
import { GenericService } from '../../../services/generic.service';
import { TravelerService } from '../../../services/traveler.service';
import { CheckOutService } from '../../../services/checkout.service';
import { CartService } from '../../../services/cart.service';
import { FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie';
import { AddCardComponent } from '../../../components/add-card/add-card.component';
import { CommonFunction } from '../../../_helpers/common-function';

export interface CartItem {

  type: string;
  module_info: {},
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  @ViewChild(AddCardComponent, { static: false }) addCardRef: AddCardComponent;
  s3BucketUrl = environment.s3BucketUrl;
  progressStep = { step1: true, step2: false, step3: false, step4: false };
  userInfo;
  isShowPaymentOption: boolean = true;
  laycreditpoints: number = 0;
  sellingPrice: number;
  flightSummary = [];
  instalmentMode = 'instalment';
  instalmentType: string = 'weekly'
  isLoggedIn: boolean = false;
  showPartialPayemntOption: boolean = true;
  redeemableLayPoints: number;
  priceData = [];
  totalLaycreditPoints: number = 0;
  isLayCreditLoading: boolean = false;
  priceSummary;
  carts = [];
  isValidData: boolean = false;
  isValidTravelers: boolean = false;
  cartLoading = false;
  loading: boolean = false;
  isCartEmpty: boolean = false;
  cartPrices = [];
  travelerForm: FormGroup;
  cardToken: string = '';
  validationErrorMessage: string = '';
  cardListChangeCount: number = 0;
  $cartIdsubscription;
  guestUserId: string = '';
  notAvailableError: string = '';
  isNotAvailableItinerary: boolean = false;
  isAllAlertClosed: boolean = true;
  isSubmitted: boolean = false;
  alertErrorMessage: string = '';
  inValidCartTravller=[]

  add_new_card = false;
  totalCard: number = 0;

  constructor(
    private router: Router,
    private flightService: FlightService,
    private genericService: GenericService,
    private travelerService: TravelerService,
    private checkOutService: CheckOutService,
    private cartService: CartService,
    private commonFunction: CommonFunction,
    private cookieService: CookieService
  ) {
    //this.totalLaycredit();
    this.getCountry();
  }

  ngOnInit() {
    window.scroll(0, 0);
    localStorage.removeItem("__alrt")
    this.userInfo = getLoginUserInfo();
    if (this.userInfo && this.userInfo.roleId != 7) {
      this.getTravelers();
    }
    else {
      this.getTravelers();
      this.guestUserId = this.commonFunction.getGuestUser();
    }

    this.cartLoading = true;
     this.cartService.getCartList('yes').subscribe((items: any) => {
      this.cartLoading = false;
      let cart: any;
      let price: any;
      for (let i = 0; i < items.data.length; i++) {
        cart = {};
        price = {}

        
        cart.type = items.data[i].type;
        cart.travelers = items.data[i].travelers;
        cart.id = items.data[i].id;
        cart.is_available = items.data[i].is_available;
        
        
        if(items.data[i].type=='flight'){
          cart.module_info = items.data[i].moduleInfo[0];
          cart.old_module_info = {
            selling_price: items.data[i].oldModuleInfo[0].selling_price
          };

          price.selling_price = items.data[i].moduleInfo[0].selling_price;
          price.departure_date = items.data[i].moduleInfo[0].departure_date;
          price.start_price = items.data[i].moduleInfo[0].start_price;
          price.location = `${items.data[i].moduleInfo[0].departure_code}-${items.data[i].moduleInfo[0].arrival_code}`
        }
        else  if(items.data[i].type=='flight'){
          cart.module_info = items.data[i].moduleInfo.data[0];
          cart.old_module_info = {
            selling_price: items.data[i].oldModuleInfo.data[0].selling.total
          };

          price.selling_price = items.data[i].moduleInfo.data[0].selling.total;
          price.departure_date = items.data[i].moduleInfo.data[0].departure_date;
          price.start_price = 0;
          price.location = items.data[i].moduleInfo.data[0].hotel_name;
        }

        this.carts.push(cart);
        this.cartPrices.push(price)

      }

      
      this.cartService.setCartItems(this.carts)
      this.cartService.setCartPrices(this.cartPrices)

    }, error => {
      this.isCartEmpty = true;
      this.cartLoading = false;
      this.carts = [];
      this.cartPrices = [];
      localStorage.setItem('$crt', '0');
    });
    /* Temp */
    /* let cart: any={};
    let price: any={};
    cart.type = 'hotel';
    cart.travelers = [];
    cart.id = 1;
    cart.is_available = true;
    cart.module_info ={
        "hotel_id": "702305676",
        "hotel_name": "Jaipur Hotel New - Heritage Hotel",
        "input_data": {
          "check_in": "2021-04-08",
          "check_out": "2021-04-09",
          "num_rooms": "1",
          "num_adults": "2",
          "num_children": "2",
          "num_nights": "1"
        },
        "amenity_data": [
          {
            "id": 1,
            "name": "Airport Shuttle"
          },
          {
            "id": 6,
            "name": "Free Internet Available"
          },
          {
            "id": 8,
            "name": "Free Internet In Public Areas"
          },
          {
            "id": 10,
            "name": "Free Parking"
          },
          {
            "id": 11,
            "name": "Accessible"
          },
          {
            "id": 12,
            "name": "No Smoking Rooms/Facilities"
          },
          {
            "id": 14,
            "name": "Restaurant"
          }
        ],
        "address": {
          "city_name": "Jaipur",
          "address_line_one": "07- Film Colony, Choura Rasta Jaipur",
          "state_code": null,
          "state_name": null,
          "country_code": "IN",
          "country_name": "India",
          "zip": "302002"
        },
        "room_id": "227093475",
        "title": "Suite Room",
        "description": "Suite Room",
        "beddings": [
          
        ],
        "available_rooms": null,
        "board_type": "",
        "retail": {
          "sub_total": null,
          "total": null,
          "taxes": null
        },
        "selling": {
          "sub_total": 54.76,
          "total": 61.33,
          "taxes": 6.57,
          "avg_night_price": 61.33
        },
        "saving_percent": null,
        "amenities": [
          
        ],
        "supplier_id": "PPN",
        "distribution_type": "PUBLIC",
        "payment_type": "PREPAID",
        "is_refundable": "true",
        "cancellation_policies": [
          {
            "description": "Any cancellation received within 1 day prior to the arrival date will incur the first night's charge. Failure to arrive at your hotel or property will be treated as a No-Show and will incur the first night's charge (Hotel policy).",
            "after": "2017-07-12 05:00:00",
            "before": "2021-04-07 12:00:00",
            "cancellation_fee": 0,
            "refund": 61.33,
            "total_charges": 0
          },
          {
            "description": "Any cancellation received within 1 day prior to the arrival date will incur the first night's charge. Failure to arrive at your hotel or property will be treated as a No-Show and will incur the first night's charge (Hotel policy).",
            "after": "2021-04-07 12:00:00",
            "before": "2021-04-08 12:00:00",
            "cancellation_fee": 0,
            "refund": 0,
            "total_charges": 61.33
          },
          {
            "description": "Any cancellation received within 1 day prior to the arrival date will incur the first night's charge. Failure to arrive at your hotel or property will be treated as a No-Show and will incur the first night's charge (Hotel policy).",
            "after": "2021-04-08 12:00:00",
            "before": "2025-01-02 07:00:00",
            "cancellation_fee": 0,
            "refund": 0,
            "total_charges": 61.33
          }
        ],
        "policies": [
          {
            "title": "Cancellation Policy",
            "paragraph_data": [
              "Any cancellation received within 1 day prior to the arrival date will incur the first night's charge. Failure to arrive at your hotel or property will be treated as a No-Show and will incur the first night's charge (Hotel policy)."
            ]
          },
          {
            "title": "Travel Insurance (Trip Protection)",
            "paragraph_data": [
              "You will receive a letter of Confirmation and Certificate of Insurance/Policy via separate e-mail.#br##br#For more Information, Please visit <a href='https://www.allianztravelinsurance.com/faq.htm' target='_blank'>FAQ's</a>. Or, to manage your policy online, <a href='https://www.allianztravelinsurance.com/account/policies/home' target='_blank'>click here</a>. If you prefer, you may also directly contact Allianz Global Assistance's <a href='https://www.allianztravelinsurance.com/contact-us.htm' target='_blank'>Customer Support Team</a> or call at 1-888-799-3063.#br##br#If you cancel your reservation, please call Allianz Global Assistance at 1-888-799-3063 to request a travel insurance refund or report a claim if cancelling for a covered reason."
            ]
          },
          {
            "title": "Pre Pay Policy",
            "paragraph_data": [
              "This hotel requires a deposit which will be charged to your credit card shortly after purchase."
            ]
          }
        ],
        "bundle": "HEC_f8EOVq_PMwApFxzs8AnnLNnIF9yvH40-KkF2sGMWZ1VBb3IplYjqfNqgN9GVH-pdmOXRGo1_CnHaWqDpLxKiN9inim3zN-6VuTEaerxFAEoooYXmU7ZezkoSFqugm4n1Avx7w0FBJydGgkGhaPG16xVDLGOJu1oE0hpROOBA3FNLzb2OudKVOWEEXvRzK8Pk7tu5UkdumR8NACtiao5HZ61zVHtQ3vOhsSE8DnJG7PgzNZms1PkxXEfr4oJByp8YQTzGgjQjxbpjr65EtFJm5TOd93pnqFlpS4H7we3t-lEOCvuBfIlRbPVa39KFXoeT64-BW7rD9r-LqJm0a_yNdXMgT5rajN0VvXbKaOr2EkcDz7VyIrBkTbfJeDkpkgTVL-EMoYk90EMIWw_JOGOWy17EGsSHvZVZGoM90pfSHOMXCWUb2kSyAof2SIAdcxtMaVn0opxYyW2RqPZjH-iw30kKxFv9WXes8gF0PTlRA5Jndvr2Se3kboPDjxL7ByseV-fo4WKUFDBOcpSLtfsLEylUuM0bkNrp-LEN-sw085yX061vGdxmrtD-gkYZTZbbU9qsIO1laWyJ33AMbbziY0hlFcCgPeiDgsAJKZhIWZYIQhCY82QPT6JpK2bUV6-WF5fWSRHnqVdxL0IgzwlaJpwcpNpAg4BenKapguxQbhaO-MFA-QEE3TlIgWC-4Pio4davnpWO05JyyBp_dBW9jXPQX82OVEO7uBzijeR8SUSChCg2s66PkgSycH0M9SSkeEGPl-a0Ue9Hh5HNF_6m-6UcxTyB7Ux_MAZ74InXmVYysLaekwxi1QHpP9CMdnAiAsIsEtdPWEXbbkSbGYJtIuvhIodJ3-FmyLdvrSi2i-oyuesXV3P7za55QzIp8F7rC-YjW0wL1-GPahuf8ZBZNHxaAWKtFc3g1SbCF-rM7VhVUxLrln8VIsoOdFd15ApyT6dtVwXaoHd0pezRJrwzYO_LvSca90yg0fC74sDplsePWUR8bSUDvf6SuMWqTUUhTYEKnzYEMNw2Dbtxh43M8f2QEpIoXMDylcuIvYmZrg_UIPT63hlm5I-1VHGtTSZ8_GnRYGvl4fLVRDV2WX6LZ1E3-sNimdcnSH2dMZLcFEa3HceXiYlwKJNhYdjJLTFkRL0RGbKXHOthAiYlMudfvClkz5ZWTviSoGeMgJ2do-VzcVuiZyyhSvFWBzv1-yjjo0wqo2MsGwRFywmveYZDgXxN23m96uuaJuOWiLo7qNGy30pB4iUuqos8uEOeRnAs8nuHrKLcLso2xJrZ-pTLGQct8ddKt_kR1RWK1K2BmfrLPnyDm_qnK0PnBXzTDOTRvexJ2SUM6hNvdOTx_6zjUr0RrbtiT_5FUiYZ4lkn-ulUHRVMT6VLwMj2laqey9P-OgTlXrs4oxvvXR-iRc2WN3uDrVFEj3aQkWB7eTIt0ZrlUyGCeW4COd-pQlsf72H6eajaUBtpQmYnP9tEOC4IDoneOwcgIvVAUDgyWPqN84-n64qxIs3cWHQoL8zWfTpB-WlTNI9yrXvl-eSZy2JElheckh2svoc1K44lQKy02xq0DqyodT86Qyl6IdMX7cqRxhccPtMbAd1R6Y137_a3zt-no5UUYIwi-wzDZheFMPQF38yOZi9MnscnW0kqaW-KnwTmJ_zMAp9cJBZCJeARxCShD_5hhLXA1qRjWN3pQQyYpW6stWruu7pxR0IM9gzAsxlMjHL1Kt7Zu4oW0iCS4SUaZPPUZCnbSn0i6iDgq2tthWlKFsrCTl1UfuTGeIvXS4JMmy2wYIGk-KgcV180WE2FIGHNbYKpacdpZh5KOXI8jhw9WaYiuB4v9g0X72LVIL28FLJZc4M7u2pXZ_h3L1QYurOoJ3MHrj4bZV9ShNN7bZly8Gc0_ucbTLRsgy4V-X9sF5XRreyAkkhm3l2U2k2yBSViW8P4LoxiTi187qLTEk2uhLLND0cqlD7gfb4m_PWThx87UKeBpFILKB01qIh5dBUKgf0Fq1sIxwrXvq3oiC0pbQWTHd1QdH5FBB4HL09JKly154lISh59OATXSTeU6fLzdyKXunMt3OHbTJliR54-YvvOVDkpjI-iOyDdhLzkxVlPSs_TVN_l9XYSz1mzgGn9J_1sF5TZmDf1iS7VHUGfHUOVavp7ws5ehlHWvnupirsXVG3Lp4GMLA5uTt9nAEa3Q73jPCmF41zvmiSkq_vhqy8Z6wWt0ut8woqiLYAyohA9kvsAeGgp7kkSe45RFgF1nn5R9OsqC0ZWjZ3Kbl1xBVGqrbhKg8vNbrlD9wFVE-74qcGoJ3VQM7n_l_j0kUEWht1sevujNtzYOopMu6w-ErUqvA3_x8j2NMdJr6uh-qjMk8Jpvq3KhsreyJ6ZPbC4mQCrKyyjiPBDNFqrUoish3uGptKxkxsUFUYl_q7LeEqaEHpL1fG7GCwy4bA-doogSL5z8OcVRQuoOffUe0Dvp5FTvXprd97t4pz05ySwHUbNxJdK7lzBF14g4qPScPpOdWSz7y9JxNdgPStLAQIXFLaiXH9_rtXHoT-QzRGk-06HA11wR5bCEsP9wxIXJLJBmOSG6mu8-mqAMFy2P2uxaJ3lXsnCpFZB2dxBp7OV0d4DNIZ_Hgos8U3md_z3IHZgZDe3DptH1ITrfprpS2ezGogvmNabFErF9h3p3hVmXhj3QnPsnD2mpjQLEilE8SThXrFZFhgYk4ywaGEVtV45wvmjd_djTvQt2vXLHBcRQVX2S4n23dZxayNmv6EGbVZJCVLZsEIQqlvX94b1F9i9XXD0AjpEGDwqrdN1MmWfpZ4N4QQeo8dn8Px7K1dNyVC-drNwKLh8923Im2U2Dkmo5XNLNU8o1RRcpjVCaFpjrfcqx4SyEZtOOpNNBKakSGZWl16CY--M6OWTa2ZA3v_o8J3CCkiKFHTde11NBk4SX-kItJu5Czb60H9Mw_mdfrfkI3elJMp3FI9aJB0bfa_2px91tuvPKCs3dD6sQn3d1G9Zuzd3RY6ElnMSAFjtMdyajcjoaGwebzVU_CTl1wwiJSuMEEjAxF5FAVksaDn-xzhSoLHACjHXhhbq1bibIrz9jAt9Pc2bzzDpVV6qrTauUewDlKX8EI_9pdktQN6Z31k6_cUX5o2i0UdcZfchZV5lxs7PSfrXd4KDTgO07lMxPXLWhvg0k2PMfjISqW4lonhCBAPto5il6-C0tKpINp7UzpWUoK1vomwpP3mB4uC319EAklcp0jKMIDZm-qbSACti_q0bhaj4MGTJkD1UuqHe4IEo6IU0zdoPiQUBmg2U0Mwa4vxfkB-QB1VStEaJhYre0YIRRLIIZfPHgGtKOGG-YSrxtlYcprRu9LkEzPdd10N5ckMcWFdJqIHdd71T1iB9NC6cnR1g8Riu5OHWuD_StmXf5e3BTu1R22bF7vymjxMV_NNaZwEaa8Muk3ODVVXvTmpS3jsTdmAmIgKb3nAbvZj8BQnPwBlO0TUIea8su2mYQzpj_VgpuU0-JD_LDxdQ42dSQaVaCaY9F-dYtvJDP7DXJIuc-WE1OIpqDT8irXW3evMhdaBYGHSXVtfkK3oCQ0KrKqF8C4ELw4AtQZlewNSLFSSq-wzmIBxn7ucUpLL7s-gnZ2qvU-jfcRYqGUqvbgEBP8Y0DCH1EWSpzh9GS3tW8tM-mYZrAoztpbVPM3cdvCStHXQrz6Iayq1pR2XvXAmO82xOpxtO5uX5y_CeJyi8X7Q0YPH8K3ljZvo-rZZk_9vjci6KymDf6TbHbZUqs9U5JDlW82Vut1ZZSZjMFhuEer5fft73k89HAmd4VAtB1MLh7Q6k5wfDx_H-CNqkDyer1vr13MTsAFoi10v83AJLIcaPD0hZdU4Pcy65P-FqQjImyiTrcqisJrkVTr2YDdkyo5MpiRHg-2mDvzs3sJpHecUG7pK8mO9zFzsYLqyiqmrGyaFvYT_70kOFMXCcnTfhHBjfHYCozVKnvuZj6FYx7MfbrPql-XzYrnjxg5P0g6LX_dWSpzuwHfrFGWPMNXT_0n7Wrvlw_7fpDzLGuRoORhbmGvpG88Xso4mFMc80VjNKOuuyFHVwkYXLSisyYu32mylii9U2ArhThD4AOqhlX89Crrng31zliMLsCwO8cgGs1aC6Hzfc1HtC6gPRIW9YwuoNAhj9zz80Ig8DNk9-7-M-vIYbYnxIERHakSEE-Iyy8W04SXcRXdLEOBpDK_pDMBEMJYItXMEkRGqmCVe3-n97BPaD3GnMR01V3oXr8PZLn8URW1UA0-vDboWYziYusazoTZeNXOXr8PdPap_iHd-ecdGwEKyTWiS8wktTB0EXGRK4QoD29gQC_EcJmK-nYV3NIJQo3anmovp4MalXmDFI2HcTZwxQT21MfvzskPXQidAGDcT3d-eOHoU20koB1-Hsw1Fv8CSO6A-7JBMFvk8Yz6aGjHzzCaA-IOyYiENwQuRY0fQNRztELDQqYmtVxN_BFKp6Ben-H2IgcAntVLjqj3H-4bdBn6m3HLN29w5CoL7funQyuANeP55uXtA3T8LMjNg-gXJkZ4Dt36I1V9-YVelHMVER2u_uR1JynmUUEUSHC4N0n2Vo2hTFbK7_Vcg4pPckn3kg3fj02f7rjE9trybdmYse5oKBGJ_TiZySWoAj4ndbiQw-XQxsUIeYBBJDx_qcHpnIoHASPN4nBnTVslWLM1E_c0CGOrSsIuDs9eqqGWZPCpCl7z4O9b_zzXvHElSWLneU4wlIM3edv9q532ud4HQ-pEbZv_77HaRq4clfUNTaQY86Q_FjwByZ556JBz7whSf_tRAroD-a1pS8ssdMgh2jG72xG-iBNxVX-gLrLnsx8UEDBsuLY4GYyYGh2UIhkzPrbCm0uBYJg4VBLkrLI9Ssz84Tcy3xvIQQj-zjBkilg02dngdyouGVqLoidAvO1_QMPlXsaXi9rGIomowWp09W9-nPLzlFZV0Q1wGKTxtDybDDmSCpA5YdZahErBZPNN4vT7Dr8WmaoG-jGWcfJVf4J44697DFfQk3ghxxT7FZt9HF5GA6tWpUGawJ9gHWOXzrHSAf9PRE8997pzYn5zqPbAY6WzYp6YySOvLnpdM570B1nYtxFOM9Cd9vJEVJ29_lC1iwSnak2kyyN-CIanyK8CRznZfqKbecV3TDaYfSpkvNCbUjp0hh9FPHKxNiOdeX3FAwhUJIvnwBj4r_BryG0Tgd7Nu6NIi8kB2kR4P29lHtUzlCLWGTMhyQ0GE7t892MDJlKZ9-7l0Bud5Gz0IQZ3WFD_OoXhKSByEaI2qIigo46BKbcM9iXK4Zt01H8HH5pBZ3R903L02Eym0AY6F0HsLwfRH-roXJPvwldiYouXmHQCUoIcqS4sA0LP1PtMw81UFNvJBAUZQtN199yuVO-WuG9L6XwVHyqJ-vummTDZiwZjR5PsMivKnvFgrHUFMgtwmcN9g4dQl70OTeq1h35ncng3oUESnZBjPKhxaKpHrgNgYmC4R8OymY62Q0I_H82mdrDO8x4cma3duzCS7lUNis3aSK22K7klunK69LHj6wFbrJ6kn5hm2YSnFt1Og2mV6zX3LkHr6GJE7LpDe2ol5Tvl6JfNppd9eJ7J9AWmZLapJ98aZ176FRvQMG-gy0FBcn9EO2dAQlb4RbbTDBlpOpPcbYGp3RY_u1c5jtgSwYGQDbil-9VRXh6NOIBi84ypCp4MMDt_Klm_6b6PisVoRCjpSRMaGn88Cc6koIdDNkKyAoeY20-rG7a0Djq-LxV3qOkNozkxMkl_2TorDLbPLA3rwLG4YZ4RGtIZlee6G1-s9vqvHdnMBLEII_vPv7yumUxElnARcYm793xmDzYipmj35NFeItmTKMToEahY4KA_e8xu1ctvra94wvdKysLBpVsNClF0EVDab-OGV0BYf57DLfMq5ilt8Y7LoodMi-e90iMX0nari9MfGmp7-mth7TAAlusYLzW8kO5uww9Cl4dL8mIbIk4XKrssatXx3IpR1DpMIb_AfdZeGg8ALFtzgjdfFwpZx6XWziIlauS5hAbSw0MggabsZJkOTMwz6ED7uzggYInkPWiplOLMNM8LMbQgmRyUcamR7iVuSWjd4_UBaUqPtASOkgcbdnHTZsK_G_b1UvtgylFf5mVzjj88HXudBydNw0pb7TD4FrFsio80LW6DwUoDq86DPT8bpceIGw5izXZzyTry2x4CReyq2uYuHwKHacpQ1HbY74m-xZbvwKyahtBjmztqMP2AKOfORM18-BIJcPXDzwtGiaPu2hLP_cQgqTC_r8OBqKvWa9WXpq-BAMJD-C1LwAWDBma68TsDnigHFchdbVg4-SkTqPLcI9taOzQGJfeTxn7kOKRvbydCWo87nVudwFTMi2w4PduoJyA-UVO3Ctg0NRJVP7ysRs5Zx-vTC3QGnZ6D0pWGvJ0kiqJPApRI00aWDmJ3d8pp3bmo3u8vUphqgtZSzHd8Rih09FTcHl4pXVJVpYig6qIJQrgsx7MPp6h_1CGeLc6-d1KdSovm_sTUscjE7ilOj5qrdUaKN_Bv10eqJaefTR_r4_r-6wIQMA2_LBIHtnkll0v01JCMsDQOH9EJmn5EKL7WoZ1KTeEYf4GtDHXyFHDb2XxL-CRFokQDcLJiK0z1U46FPd78rEKQj7xyGl6-rvs2djD0E7JgDeZRK1NH4f-V_ztDcLthrnzxRciuMvjngQ_Zy9Qd0u9JZw-EN1kL3j2ONuTOPrvMhUpLOCQEXK4RyxaIRp9_eSu8xykV0iAcmXBWmlUPXjes4ErZDayAiFvY0s7UueoCtIguRBYZACiSbbhA8nHIvvbN8Dt_snKTeqOBKIpJlejPSYsWUlr3VRov8eTEcGYxKTofhxcw9Kcf3Zl41Y6mTnnm_aLCOCMgiSc48tZdhr_Vqgeo5ll4WA3AefVDf_bCLHiI9bhY7YQwXlJ5DnSwYiBJjICbcqG9SIDjy1Jix1x2GC2s7K2C1VnpD2J0kfmr5Cmt9WmbNpuWPAgPHbf8csrLEOK_JkktTxIZ_pIMMzJm9qnpTPKBjfjOojKDDNik5hI7_Gz4i6VilXR_rkoJfFtu9APWuZwNkh0PTnhNnBQ01o2-83xKehKeK3bKi0NB6ealhmDpVWbrGjk7w2Fat7Tl2SVGLPDBvjXQBRlW-mcA"
      }
    cart.old_module_info = {
      selling_price: 100
    };

    price.selling_price = 100;
    price.departure_date = '12/12/2021';
    price.start_price = 20;
    price.location = 'Sample'
    
    this.carts.push(cart);
    this.cartPrices.push(price) */
  /* !temp */

    this.$cartIdsubscription = this.cartService.getCartId.subscribe(cartId => {

      if (cartId > 0) {
        this.deleteCart(cartId);
      }
    })

    try {
      this.cardToken = this.cookieService.get('__cc');
      this.cardToken = this.cardToken || '';
    }
    catch (e) {
      this.cardToken = '';
    }

    this.checkOutService.getTravelerFormData.subscribe((travelerFrom: any) => {
      this.isValidTravelers = travelerFrom.status === 'VALID' ? true : false;
      this.travelerForm = travelerFrom;
      if (this.carts.length && this.isSubmitted) {
        this.validationErrorMessage = '';
        this.validateCartItems();
      }
    })

    this.cartService.getLoaderStatus.subscribe(state=>{
      this.loading=state;
    })

    this.genericService.getCardItems.subscribe((res:any)=>{

      if(this.totalCard!=res.length){
        this.totalCard=res.length;
        this.add_new_card = false;
      }
    })
    console.log("this.carts",this.carts)

    sessionStorage.setItem('__insMode', btoa(this.instalmentMode))
  }

  totalNumberOfcard(event) {
    console.log(event,"------");
    //this.totalCard = event;
  }

  addNewCard() {
    this.add_new_card = true;
  }

  closeNewCardPanel(event) {
    console.log("Event",event)
    this.add_new_card = event;
  }

  ngAfterViewInit() {
    this.userInfo = getLoginUserInfo();
    if (this.userInfo && Object.keys(this.userInfo).length > 0) {
      this.getTravelers();
    }
  }

  totalLaycredit() {
    this.isLayCreditLoading = true;
    this.genericService.getAvailableLaycredit().subscribe((res: any) => {
      this.isLayCreditLoading = false;
      this.totalLaycreditPoints = res.total_available_points;
    }, (error => {
      this.isLayCreditLoading = false;
    }))
  }

  applyLaycredit(laycreditpoints) {
    this.laycreditpoints = laycreditpoints;
    this.isShowPaymentOption = true;
    if (this.laycreditpoints >= this.sellingPrice) {
      this.isShowPaymentOption = false;
    }
  }

  getSellingPrice() {

    let payLoad = {
      departure_date: moment(this.flightSummary[0].departure_date, 'DD/MM/YYYY').format("YYYY-MM-DD"),
      net_rate: this.flightSummary[0].net_rate
    }
    this.flightService.getSellingPrice(payLoad).subscribe((res: any) => {

      this.priceData = res;
      this.sellingPrice = this.priceData[0].selling_price;
    }, (error) => {

    })
  }

  selectInstalmentMode(instalmentMode) {
    this.instalmentMode = instalmentMode;
    this.showPartialPayemntOption = (this.instalmentMode == 'instalment') ? true : false
    sessionStorage.setItem('__insMode', btoa(this.instalmentMode))
  }

  getInstalmentData(data) {

    this.instalmentType = data.instalmentType;
    //this.laycreditpoints = data.layCreditPoints;
    this.priceSummary = data;
    this.checkOutService.setPriceSummary(this.priceSummary)
    sessionStorage.setItem('__islt', btoa(JSON.stringify(data)))
  }


  ngDoCheck() {
    let userToken = localStorage.getItem('_lay_sess');
    this.userInfo = getLoginUserInfo();

    if (userToken) {
      this.isLoggedIn = true;
    }
  }

  redeemableLayCredit(event) {
    this.redeemableLayPoints = event;
  }

  getTravelers() {
    this.travelerService.getTravelers().subscribe((res: any) => {
      //this.travelers=res.data;
      this.checkOutService.setTravelers(res.data)
    })
  }

  getCountry() {
    this.genericService.getCountry().subscribe(res => {
      this.checkOutService.setCountries(res);
    })
  }

  handleSubmit() {
    this.router.navigate(['/flight/checkout']);
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

    if (this.addCardRef) {
      this.addCardRef.ngOnDestroy();
    }
    this.cartService.setCartNumber(0);
    this.cartService.setCardId(0);
    this.$cartIdsubscription.unsubscribe();
  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }

  deleteCart(cartId) {
    if (cartId == 0) {
      return;
    }
    this.loading = true;

    this.cartService.deleteCartItem(cartId).subscribe((res: any) => {
      this.loading = false;
      this.redirectTo('/cart/booking');
      let index = this.carts.findIndex(x => x.id == cartId);
      this.carts.splice(index, 1);
      this.cartPrices.splice(index, 1);
      localStorage.removeItem('$cartOver');

      setTimeout(() => {
        this.cartService.setCartItems(this.carts);
        this.cartService.setCartPrices(this.cartPrices)
      }, 2000)
      if (this.carts.length == 0) {
        this.isCartEmpty = true;
      }

      if (index > 0) {
        this.cartService.setCartNumber(index - 1);
      }

      localStorage.setItem('$crt', JSON.stringify(this.carts.length));
      this.cartService.setDeletedCartItem(index)
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

  saveAndSearch() {
    this.router.navigate(['/']);
    return false;
    this.validationErrorMessage = '';
    if (this.isValidTravelers) {
      this.loading = true;
      for (let i = 0; i < this.carts.length; i++) {
        let data = this.travelerForm.controls[`type${i}`].value.adults;
        let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
        let cartData = {
          cart_id: this.carts[i].id,
          travelers: travelers
        }
        this.cartService.updateCart(cartData).subscribe(data => {
          if (i === this.carts.length - 1) {
            this.loading = false;
            this.router.navigate(['/'])
          }
        });
      }
    }
    else {
      this.validateCartItems();
    }
  }

  selectCreditCard(data) {
    this.cardToken = data;
    this.cookieService.put("__cc", this.cardToken);
    this.validationErrorMessage = '';
    this.validateCartItems();
  }

  removeValidationError() {
    this.validationErrorMessage = '';
  }

  validateCartItems() {
    this.validationErrorMessage = '';
    this.inValidCartTravller=[];
    /* if (!this.isValidTravelers) { */
      //this.validationErrorMessage = 'Complete required fields in Traveler Details for'
      let message = '';

      for (let i in Object.keys(this.travelerForm.controls)) {
        message = '';
        for(let j=0; j< this.travelerForm.controls[`type${i}`]['controls'].adults.controls.length; j++){
          if(typeof this.carts[i] != 'undefined' && this.carts[i].is_available && this.travelerForm.controls[`type${i}`]['controls'].adults.controls[j].status=='INVALID'){


            if(this.validationErrorMessage==''){
              this.validationErrorMessage = 'Complete required fields in Traveler Details for'
            }
            if(!this.inValidCartTravller.includes(i)){
              message = ` ${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} ,`;
              this.validationErrorMessage += message;
            }
            this.isValidTravelers=false;
            this.inValidCartTravller.push(i)
          }
          if(typeof this.carts[i] != 'undefined' && this.carts[i].is_available && this.travelerForm.controls[`type${i}`]['controls'].adults.controls[j].status=='VALID'){

            if(this.carts[i].is_available && this.travelerForm.controls[`type${i}`]['controls'].adults.controls[j].value.userId==""){

              if(this.validationErrorMessage==''){
                this.validationErrorMessage = 'Complete required fields in Traveler Details for'
              }
              if(!this.inValidCartTravller.includes(i)){
                message = ` ${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} ,`;
                this.validationErrorMessage += message;
              }
              
              this.isValidTravelers=false;
              this.inValidCartTravller.push(i)
            }
          }
        }
      }

      let index = this.validationErrorMessage.lastIndexOf(" ");
      this.validationErrorMessage = this.validationErrorMessage.substring(0, index);
    /* } */

    let notAvailableMessage = '';
    this.notAvailableError = 'Itinerary is not available from ';
    for (let i = 0; i < this.carts.length; i++) {
      notAvailableMessage = '';
      if (!this.carts[i].is_available) {
        this.isNotAvailableItinerary = true;
        notAvailableMessage = ` ${this.carts[i].module_info.departure_code}- ${this.carts[i].module_info.arrival_code} ,`;
        this.notAvailableError += notAvailableMessage;
      }
    }

    if (this.isNotAvailableItinerary) {
      let index = this.notAvailableError.lastIndexOf(" ");
      this.notAvailableError = this.notAvailableError.substring(0, index);
      //this.notAvailableError +='.';
    }

    let cartAlerts: any = localStorage.getItem("__alrt")
    this.alertErrorMessage = '';
    try {

      if (cartAlerts) {
        this.alertErrorMessage = 'Please close alert of price change for';
        cartAlerts = JSON.parse(cartAlerts);
        if (cartAlerts.length) {
          for (let i = 0; i < cartAlerts.length; i++) {
            if (cartAlerts[i].type == 'price_change') {
              this.alertErrorMessage += ` ${cartAlerts[i].name} ,`
            }
          }
          let index = this.alertErrorMessage.lastIndexOf(" ");
          this.alertErrorMessage = this.alertErrorMessage.substring(0, index);
          /* for (let i = 0; i < cartAlerts.length; i++) {
            if (cartAlerts[i].type == 'installment_vartion') {
              if (cartAlerts.length == 1) {
                this.alertErrorMessage = "Please close alert of odd installment amount.";
              }
              else {
                this.alertErrorMessage += ` and odd installment amount.`;
              }
            }
          } */

          this.isAllAlertClosed = false;
        }
        else {
          this.isAllAlertClosed = true;
        }
      }
      else {
        this.isAllAlertClosed = true;
      }
    }
    catch (e) {
      this.isAllAlertClosed = true;
    }
  }

  continueToCheckout() {

    this.validationErrorMessage = '';
    this.validateCartItems();
    this.isSubmitted = true;

    if (this.cardToken == '') {
      if (this.validationErrorMessage == '') {
        this.validationErrorMessage = ` Please select credit card`;
      }
      else {
        this.validationErrorMessage += ` and please select credit card`;
      }
    }

    if (this.isValidTravelers && this.cardToken != '' && !this.isNotAvailableItinerary && this.isAllAlertClosed) {
      this.loading = true;
      this.travelerForm.enable();
      for (let i = 0; i < this.carts.length; i++) {
        let data = this.travelerForm.controls[`type${i}`].value.adults;
        //console.log(data,"=======",this.travelerForm);
        //return false;
        //let travelers = data.map(traveler => { return { traveler_id: traveler.userId } })
        let travelers=[];
        for(let k=0; k<data.length; k++){
          travelers.push({
            traveler_id: data[k].userId
          })
        }
        let cartData = {
          cart_id: this.carts[i].id,
          travelers: travelers
        }
        this.cartService.updateCart(cartData).subscribe(data => {
          if (i === this.carts.length - 1) {
            this.loading = false;
            this.router.navigate(['/cart/checkout'])
          }
        });
      }
    }
  }

  getCardListChange(data) {
    //this.add_new_card = false;
    this.cardListChangeCount = data;
  }

  removeNotAvailableError() {
    this.isNotAvailableItinerary = false;
  }

  removeAllAlertError() {
    this.isAllAlertClosed = true;
  }
}
