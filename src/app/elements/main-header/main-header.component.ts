import { Component, OnInit, DoCheck } from '@angular/core';
import { GenericService } from '../../services/generic.service';
import { LangunageModel, Langunage } from '../../model/langunage.model';
import { environment } from '../../../environments/environment';
import { Currency, CurrencyModel } from '../../model/currency.model';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit ,DoCheck {

    langunages:Langunage[]=[];
    selectedLanunage:Langunage={ id : 0, name : '', iso_1Code:'', iso_2Code:'',active:false};
    isLanunageSet:boolean=false;

    currencies:Currency[]=[];
    selectedCurrency:Currency={ id:0, country:'', code:'',symbol:'', status:false, flag:'' }
    isCurrencySet:boolean=false;

    isLoggedIn = false;

    s3BucketUrl = environment.s3BucketUrl;
    constructor(
      private genericService:GenericService,
      public translate: TranslateService,
      public modalService: NgbModal,
      public router: Router,
      ) { 
        let _langunage = localStorage.getItem('_lang');
        let _currency = localStorage.getItem('_curr');
        if(_langunage){

          try{

            let _lang = JSON.parse(_langunage);
            this.selectedLanunage = _lang;
            translate.setDefaultLang(this.selectedLanunage.iso_1Code);
            this.isLanunageSet=true;
          }
          catch(error){
            this.isLanunageSet=false;
            translate.setDefaultLang('en');
          }          
        }
        else{
          translate.setDefaultLang('en');
        }

        if(_currency){

          try{
            let _curr = JSON.parse(_currency);
            this.selectedCurrency = _curr;
            this.isCurrencySet=true;
          }
          catch(error){
            this.isCurrencySet=false;
          }
        }

    }

    ngOnInit(): void {
      this.getLangunages();
      this.getCurrencies();  
      this.checkUser();
      this.loadJquery();
    }
   
    ngDoCheck() {      
      this.checkUser();
    }

    /**
     * change user lanunage
     * @param langunage 
     */
    changeLangunage(langunage:Langunage){

        if(JSON.stringify(langunage)!=JSON.stringify(this.selectedLanunage)){
            this.selectedLanunage = langunage;
            localStorage.setItem("_lang", JSON.stringify(langunage))
            this.translate.use(langunage.iso_1Code);
        }
    }

    /**
     * Get all langunages
     */
    getLangunages(){
      this.genericService.getAllLangunage().subscribe(
        (response:LangunageModel)=>{
          this.langunages = response.data.filter(lang => lang.active==true);
          if(!this.isLanunageSet){
            this.isLanunageSet=true;
            this.selectedLanunage=this.langunages[0];
            localStorage.setItem("_lang", JSON.stringify(this.langunages[0]))
          }
        },
        (error)=>{

        }
      )
    }

    /**
     * Get all currencies
     */
    getCurrencies(){

      this.genericService.getCurrencies().subscribe(
        (response:CurrencyModel)=>{

          this.currencies = response.data.filter(currency=>currency.status==true);
          for(let i=0; i<this.currencies.length; i++){
            this.currencies[i].flag= `${this.s3BucketUrl}assets/images/icon/${this.currencies[i].code}.svg`;
          }
          if(!this.isCurrencySet){

            this.isCurrencySet=true;
            this.selectedCurrency=this.currencies[0];
            
            localStorage.setItem("_curr", JSON.stringify(this.currencies[0]))
          }
        },
        (error)=>{

        }
      )
    }

    changeCurrency(currency:Currency){
      if(JSON.stringify(currency)!=JSON.stringify(this.selectedCurrency)){
        this.selectedCurrency = currency;
        localStorage.setItem("_curr", JSON.stringify(currency))
      }
    }

    checkUser() {
      let userToken = localStorage.getItem('_lay_sess');
      this.isLoggedIn = false;
      if( userToken && userToken != 'undefined' && userToken != 'null') { 
        this.isLoggedIn = true;
      } 
    }

    onLoggedout() {
      this.isLoggedIn = false;
      localStorage.removeItem('_lay_sess');
      this.router.url;
    }    

    loadJquery(){
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
}
