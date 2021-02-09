import { BaseLoginProvider, SocialUser } from 'angularx-social-login';
import { environment } from '../../../../environments/environment';

declare let AppleID: any;

export class AppleLoginProvider extends BaseLoginProvider {
    public static readonly PROVIDER_ID: string = 'APPLE';

    protected auth2: any;

    constructor(
        private clientId: string,
        private _initOptions: any = { scope: 'email name' }
    ) {
        super();
    }

    public initialize(): Promise<void> {
        return new Promise((resolve, _reject) => {
            this.loadScript(
                AppleLoginProvider.PROVIDER_ID,
                'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js',
                () => {
                    AppleID.auth.init({
                        clientId: 'com.laytrip.laytrips',
                        scope: 'name email',
                        redirectURI: environment.siteUrl,
                        state: '[ANYTHING]', // used to prevent CSFR
                        usePopup: true,
                    });
                    resolve();
                }
            );
        });
    }

    public getLoginStatus(): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            // todo: implement
            resolve();
        });
    }

    public async signIn(signInOptions?: any): Promise<SocialUser> {
        return new Promise((resolve, reject) => {
            try {
                const data = AppleID.auth.signIn();
                resolve(data);
            } catch (er) {
                console.log(er);
            }
        });
    }

    public signOut(revoke?: boolean): Promise<any> {
        return new Promise((resolve, reject) => {
            // AppleID doesnt have revoke method
            resolve();
        });
    }
}