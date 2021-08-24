// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'default',
  apiUrl:'https://api.uat.staging.laytrip.com/',
  s3BucketUrl: 'https://d2q1prebf1m2s9.cloudfront.net/',
  fb_api_key:'933948490440237',
  google_client_id:'154754991565-9lo2g91remkuefocr7q2sb92g24jntba.apps.googleusercontent.com',
  siteUrl: 'https://alpha.laytrip.com',
  VAPID_PUBLIC_KEY:'BLqKtvo8fc7ZHJ5m2j4RYbAoJJ6WtdUYNH38ZaStSIuecp1sCcrE7CFkFT266FCpeky4nBR5_yNgxygoLqE3jJ4'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
