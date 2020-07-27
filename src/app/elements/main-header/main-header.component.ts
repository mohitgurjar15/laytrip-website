import { Component, OnInit } from '@angular/core';
import { GenericService } from 'src/app/services/generic.service';
import { LangunageModel, Langunage } from 'src/app/model/langunage.model';
import { environment } from 'src/environments/environment';
import { Currency, CurrencyModel } from 'src/app/model/currency.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss']
})
export class MainHeaderComponent implements OnInit {

    langunages:Langunage[]=[];
    selectedLanunage:Langunage={ id : 0, name : '', iso_1Code:'', iso_2Code:'',active:false};

    currencies:Currency[]=[];
    selectedCurrency:Currency={ id:0, country:'', code:'',symbol:'', status:false }

    s3BucketUrl = environment.s3BucketUrl;
    constructor(
      private genericService:GenericService,
      public translate: TranslateService
    ) { 
      translate.setDefaultLang('en');
    }

    ngOnInit(): void {
        
      this.getLangunages();
      this.getCurrencies();
    }

    /**
     * change user lanunage
     * @param langunage 
     */
    changeLangunage(langunage:Langunage){


      if(JSON.stringify(langunage)!=JSON.stringify(this.selectedLanunage)){
          this.selectedLanunage = langunage;
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
          console.log(this.langunages)
          this.selectedLanunage=this.langunages[0];
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
          this.selectedCurrency=this.currencies[0];
          console.log(this.selectedCurrency)
        },
        (error)=>{

        }
      )
    }

    changeCurrency(currency:Currency){
      if(JSON.stringify(currency)!=JSON.stringify(this.selectedCurrency)){
        this.selectedCurrency = currency;
      }
    }
}
