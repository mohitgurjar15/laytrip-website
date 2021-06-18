import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { LANDING_PAGE } from "./src/landing-page.config";
import { LandingPageData } from "./landing-page-data.model";
import { HomeService } from "./services/home.service";

@Injectable()
export class PreloadingService {

    private ladingPageData :LandingPageData= null;

    constructor(
        private http: HttpClient,
        private homeService : HomeService
        ) {

    }

    public getLandingPageData() : LandingPageData {
        return this.ladingPageData;
    }

    load() {      
       return new Promise((resolve, reject) => {
            this.http
                .get('https://api.icndb.com/jokes/random')
                .pipe(map(res => {
                    this.ladingPageData = LANDING_PAGE['AS-410'];
                    // this.homeService.setLandingPageData(LANDING_PAGE['AS-410']);

                })).subscribe(response => {
                    // console.log('here')
                      console.log(response)
                    // this.ladingPageData = response['value'];
                    resolve(true);
                })
        })
    }
}