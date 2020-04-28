import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { AppConfigService } from '../service/AppConfig.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    base_url;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private appConfigService: AppConfigService
    ) {
    }

    handleError(error) {
        this.base_url = this.appConfigService.config['base_url'];
        console.log(error['url'].toString());


        if (this.base_url + 'auth/logout' == error.url) {
        }
        else if (error['url'].toString().indexOf('action=logout') != -1) {
            console.log('indexof', error['url'].toString().indexOf('action=logout'));
            //this.authService.logout();
            //this.router.navigate(['login']); 
        }
        else if (error['status'] == 401) {
            // console.log(error['status'], error['status'], error['status'], error['status']);
            // this.authService.onUnauthorized();
            // this.router.navigate(['login']);
        }
    }
}
