import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LANDING_PAGE } from "../landing-page.config";
import { Router } from "@angular/router";

@Injectable()
export class PreloadingService {

    public landingPageData: any = new BehaviorSubject<any>({});
    
    getLandingPageData = this.landingPageData.asObservable();

    constructor(
        private http: HttpClient,
        private router: Router
        ) { }

    load(): Promise<any> {
        const encode = require('jwt-encode');
        localStorage.setItem('__LP_DATA', "")

        return new Promise((resolve, reject) => {
            this.http.get('https://api.staging.laytrip.com/v1/landing-page/AS-411').subscribe((response: any) => {
                localStorage.setItem('__LP_DATA', encode(LANDING_PAGE['AS-410'], 'secret'));
                resolve(true);
            });
        });
    }
}