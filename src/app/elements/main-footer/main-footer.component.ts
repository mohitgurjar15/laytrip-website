import { Component, OnInit, Renderer2 } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareSocialMediaComponent } from '../../components/share-social-media/share-social-media.component';
import { environment } from '../../../environments/environment';
import { Currency, CurrencyModel } from '../../model/currency.model';
import { LangunageModel, Langunage } from '../../model/langunage.model';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunction } from '../../_helpers/common-function';
import { GenericService } from '../../services/generic.service';
declare var $: any;

@Component({
  selector: 'app-main-footer',
  templateUrl: './main-footer.component.html',
  styleUrls: ['./main-footer.component.scss']
})
export class MainFooterComponent implements OnInit {

  s3BucketUrl = environment.s3BucketUrl;
  langunages: Langunage[] = [];
  selectedLanunage: Langunage = { id: 0, name: '', iso_1Code: '', iso_2Code: '', active: false };
  isLanunageSet: boolean = false;
  currencies: Currency[] = [];
  isCurrencySet: boolean = false;
  countryCode: string = '';
  selectedCurrency: Currency = { id: 0, country: '', code: '', symbol: '', status: false, flag: '' }

  constructor(private modalService: NgbModal,
    public translate: TranslateService,
    private commonFunction: CommonFunction,
    private renderer: Renderer2,
    private genericService: GenericService,
  ) {

    this.countryCode = this.commonFunction.getUserCountry();
    let _langunage = localStorage.getItem('_lang');
    let _currency = localStorage.getItem('_curr');
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

    if (_currency) {

      try {
        let _curr = JSON.parse(_currency);
        this.selectedCurrency = _curr;
        this.isCurrencySet = true;
      }
      catch (error) {
        this.isCurrencySet = false;
      }
    }

    this.countryCode = this.commonFunction.getUserCountry();
  }

  ngOnInit(): void {
    this.getLangunages();
    this.getCurrencies();
    this.loadJquery();
  }

  loadJquery() {
    // Start Back to Top Js
    $(window).scroll(function () {
      var height = $(window).scrollTop();
      if (height > 100) {
        $('#back_to_top').fadeIn();
      } else {
        $('#back_to_top').fadeOut();
      }
    });
    $(document).ready(function () {
      $("#back_to_top").click(function (event) {
        event.preventDefault();
        $("html, body").animate({
          scrollTop: 0
        }, "slow");
        return false;
      });

    });
    // Close Back to Top Js
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
    }
  }

  /**
   * Get all langunages
   */
  getLangunages() {
    this.genericService.getAllLangunage().subscribe(
      (response: LangunageModel) => {
        this.langunages = response.data.filter(lang => lang.active == true);
        if (!this.isLanunageSet) {
          this.isLanunageSet = true;
          this.selectedLanunage = this.langunages[0];
          localStorage.setItem("_lang", JSON.stringify(this.langunages[0]))
        }
        else {
          let find = this.langunages.find(langunage => langunage.id == this.selectedLanunage.id)
          if (!find) {
            this.isLanunageSet = true;
            this.selectedLanunage = this.langunages[0];
            localStorage.setItem("_lang", JSON.stringify(this.langunages[0]))
          }
        }
      },
      (error) => {

      }
    )
  }

  /**
  * Get all currencies
  */
  getCurrencies() {

    this.genericService.getCurrencies().subscribe(
      (response: CurrencyModel) => {

        this.currencies = response.data.filter(currency => currency.status == true);
        for (let i = 0; i < this.currencies.length; i++) {
          this.currencies[i].flag = `${this.s3BucketUrl}assets/images/icon/${this.currencies[i].code}.svg`;
        }
        if (!this.isCurrencySet) {

          this.isCurrencySet = true;
          this.selectedCurrency = this.currencies[0];

          localStorage.setItem("_curr", JSON.stringify(this.currencies[0]))
        }
        else {
          let find = this.currencies.find(currency => currency.id == this.selectedCurrency.id)
          if (!find) {
            this.isCurrencySet = true;
            this.selectedCurrency = this.currencies[0];
            localStorage.setItem("_curr", JSON.stringify(this.currencies[0]))
          }
        }
      },
      (error) => {

      }
    )
  }

  changeCurrency(currency: Currency) {
    if (JSON.stringify(currency) != JSON.stringify(this.selectedCurrency)) {
      this.selectedCurrency = currency;
      localStorage.setItem("_curr", JSON.stringify(currency))
    }
  }

  openShare() {
    const modalRef = this.modalService.open(ShareSocialMediaComponent, { windowClass: 'share_modal', centered: true });
    modalRef.componentInstance.name = 'World';
  }
}
