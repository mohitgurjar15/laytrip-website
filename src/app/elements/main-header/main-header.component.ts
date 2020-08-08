import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { LangunageModel, Langunage } from 'src/app/model/langunage.model';
import { environment } from 'src/environments/environment';
import { Currency, CurrencyModel } from 'src/app/model/currency.model';
import { TranslateService } from '@ngx-translate/core';
import { ModuleModel, Module } from 'src/app/model/module.model';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

    langunages:Langunage[]=[];
    selectedLanunage:Langunage={ id : 0, name : '', iso_1Code:'', iso_2Code:'',active:false};
    isLanunageSet:boolean=false;

    currencies:Currency[]=[];
    selectedCurrency:Currency={ id:0, country:'', code:'',symbol:'', status:false }
    isCurrencySet:boolean=false;


    s3BucketUrl = environment.s3BucketUrl;
    constructor(
      private genericService:GenericService,
      public translate: TranslateService
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
      /* this.genericService.test().subscribe((res:any)=>{
          console.log(res);
      }) */
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
          console.log(this.selectedCurrency)
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

    
}
