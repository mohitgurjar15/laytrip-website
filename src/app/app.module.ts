import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementsModule } from './elements/elements.module';
import { ComponentsModule } from './components/components.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { AppleLoginProvider } from './pages/user/social-login/apple.provider';
import { AuthGuard } from './guard/auth.guard';
import { PreloadingService } from './services/preloading.service';
import { ActivatedRoute } from '@angular/router';


/* export function preloadProvider(preLoadService: PreloadingService) {
   return (): Promise<any> => {
    
    return preLoadService.load();
  }
} */
@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpClientModule,
    ElementsModule,
    FormsModule,
    ComponentsModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    SocialLoginModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [ 
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: AppleLoginProvider.PROVIDER_ID,
            provider: new AppleLoginProvider(
              'com.laytrip.laytrips'
            ),
          },
        ] 
      } as SocialAuthServiceConfig,
    },
    AuthGuard,
    PreloadingService,
    /* { 
      provide: APP_INITIALIZER, 
      useFactory: preloadProvider,
      deps: [PreloadingService],
      multi: true
    }  */
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
