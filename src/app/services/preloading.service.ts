import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

import { environment } from '../../environments/environment';
import { HomeService } from "./home.service";
import { LANDING_PAGE } from "../landing-page.config";

@Injectable()
export class PreloadingService {

    public landingPageData: any = new BehaviorSubject<any>({});
    
    getLandingPageData = this.landingPageData.asObservable();

    constructor(
        private http: HttpClient,
        private homeService : HomeService
        ) {

    }

    load(): Promise<any> {
        const encode = require('jwt-encode');
        localStorage.setItem('__LP_DATA', "")

        return new Promise((resolve, reject) => {
            this.http.get('https://api.staging.laytrip.com/v1/landing-page/AS-411').subscribe((response: any) => {
                console.log('here')
                localStorage.setItem('__LP_DATA', encode(LANDING_PAGE['AS-410'], 'secret'))
                resolve(true);
            }, err => {
                console.log('error')
                localStorage.setItem('__LP_DATA','')
            },);
        });
    }
}