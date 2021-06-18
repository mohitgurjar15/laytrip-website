import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LANDING_PAGE } from "./landing-page.config";
import { LandingPageData } from "./landing-page-data.model";
import { HomeService } from "./services/home.service";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class PreloadingService {

    // private ladingPageData :any= null;
    private landingPageData : any = new BehaviorSubject({});
    
    getLandingPageData = this.landingPageData.asObservable();

    constructor(
        private http: HttpClient,
        private homeService : HomeService
        ) {

    }

    /*public  getLandingPageData()  {
        return this.ladingPageData;
    }*/

    load(): Promise<any> {
        return new Promise((resolve, reject) => {
          this.http.get('https://api.icndb.com/jokes/random').subscribe((response: any) => {
                
             // this.ladingPageData = LANDING_PAGE['AS-410'];
              this.landingPageData.next(LANDING_PAGE['AS-410']);

                console.log("this.ladingPageData",this.landingPageData)
              resolve(true);
        });
      });
    }
    /*load() {      
       return new Promise((resolve, reject) => {
            this.http
                .get('https://api.icndb.com/jokes/random')
                .map(res => {
                    this.ladingPageData = LANDING_PAGE['AS-410'];
                    // this.homeService.setLandingPageData(LANDING_PAGE['AS-410']);

                }).subscribe(response => {
                    // console.log('here')
                      console.log("subscribe",response)
                       // this.homeService.setLandingPageData(LANDING_PAGE['AS-410']);

                    // this.ladingPageData = response['value'];
                    resolve(true);
                })
        })
    }*/
}