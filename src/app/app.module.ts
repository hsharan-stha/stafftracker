import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule, APP_INITIALIZER} from '@angular/core';
import {TextMaskModule} from 'angular2-text-mask';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {DataService} from './service/data.service';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslatePipeModule} from './translation/translate.module';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppConfigService} from './service/AppConfig.service';
import {HeaderInterceptorProvider, ErrorInterceptorProvider} from './core/http-interceptor.service';
import {GlobalErrorHandler} from './core/global-error-handler.service';
import {CustomLoader} from './translation/custom-loader';
import {AlertMessageComponent} from "./alert-message/alert-message.component";

export function tokenGetter() {
    //console.log(localStorage.getItem('access_token'));
    return localStorage.getItem('access_token');
}

const appInitializerFn = (appConfig: AppConfigService) => {
    return () => {
        return appConfig.loadAppConfig();
    }
};

@NgModule({
    declarations: [
        AppComponent,
        AlertMessageComponent

    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        TextMaskModule,
        NgbModule.forRoot(),
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        TranslatePipeModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useClass: CustomLoader,
                //useFactory: (HttpLoaderFactory),
                deps: [HttpClient, AppConfigService]
            }
        })
    ],
    providers: [
        DataService,
        AppConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFn,
            multi: true,
            deps: [AppConfigService]
        },
        HeaderInterceptorProvider,
        ErrorInterceptorProvider,
        GlobalErrorHandler
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        AlertMessageComponent
    ]
})
export class AppModule {
}

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}
