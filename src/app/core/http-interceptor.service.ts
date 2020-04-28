import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HTTP_INTERCEPTORS, HttpResponse, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpUserEvent } from '@angular/common/http';
import { catchError, switchMap, finalize, filter, take, map } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';
import { throwError as observableThrowError, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  base_url;
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  /**
   * Intercepts an outgoing HTTP request, executes it and handles any error that could be triggered in execution.
   * @see HttpInterceptor
   * @param req the outgoing HTTP request
   * @param next a HTTP request handler 
   */
  constructor(
    private router: Router,
    private injector: Injector
  ) { }

  addToken(req: HttpRequest<any>, token: string, isExpired: boolean): HttpRequest<any> {
    let clonedRequest = req.clone({});
    console.log(req);
    console.log(req.headers.get('Authorization'));
    if (isExpired) {
    }
    else if (req.headers.get('Authorization')) {
      //check if refresh token is already added
      console.log("req.headers['Authorization']", req.headers.get('Authorization'));
    }
    else {
      //only add token when unexpired or refresh token is not added
      clonedRequest = req.clone({
        setHeaders: {
          //      'Access-Control-Allow-Origin': '*',
          //      Accept: `application/json`,
          //                   'Content-Type': 'application/json',
          'Authorization': token
          //     CrossDomain: 'true' 
        }
      });
    }
    return clonedRequest;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    const authService = this.injector.get(AuthenticationService);
    console.log(authService.isTokenExpired());
    return next.handle(this.addToken(req, authService.getAuthToken(), authService.isTokenExpired())).pipe(
      catchError(error => {
        console.log(error);
        if (error.error && error.error['code'] && error.error['code'] == -2) {
          console.log("error.error['code']", error.error['code']);
          return this.logoutUser();
          //observableThrowError(error);
        }
        else if (error instanceof HttpErrorResponse) {
          switch ((<HttpErrorResponse>error).status) {
            case 400:
              return this.handle400Error(error);
            case 401:
              return this.handle401Error(req, next);
            default:
              return observableThrowError(error);
          }
        }

        else {
          return observableThrowError(error);
        }
      }));
  }

  handle400Error(error) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.logoutUser();
    }
    return observableThrowError(error);
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    console.log('handle401Error', req);
    const authService = this.injector.get(AuthenticationService);
    if (!this.isRefreshingToken && !authService.isTokenExpired()) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      const authService = this.injector.get(AuthenticationService);

      return authService.refreshToken().pipe(

        switchMap((newToken: string) => {
          console.log('.................newToken newToken', newToken, newToken['result']['token']);
          if (newToken) {
            console.log(newToken);
            authService.setAccessToken(JSON.stringify(newToken['result']['token']));
            this.tokenSubject.next(newToken);
            return next.handle(this.addToken(req, newToken['result']['token'], authService.isTokenExpired()));
          }

          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser();
        }),
        catchError(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          console.log(error);
          return this.logoutUser();
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        }));
    } else {
      return this.tokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(token => {
          console.log('...........................token,', token);
          authService.setAccessToken(JSON.stringify(token['result']['token']));
          return next.handle(this.addToken(req, token['result']['token'], authService.isTokenExpired()));
        }));
    }
  }

  logoutUser() {
    // Route to the login page (implementation up to you)
    const authService = this.injector.get(AuthenticationService);
    console.log('logout.....');
    authService.onUnauthorized();
    this.router.navigate(['/']);
    return observableThrowError("");
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HttpErrorInterceptor,
  multi: true,
};





@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let clonedRequest = req.clone();
    if (this.authService.isTokenExpired()) {
      // Clone the request to add the new header
      clonedRequest = req.clone({
        setHeaders: {
          //'Access-Control-Allow-Origin': '*',
          //Accept: `application/json`,
          //                    'Content-Type': `application/json`,
          //CrossDomain: 'true'  
        }
      });
    } else {
      //if token  exist / unexpired add access token as sessionb token
      clonedRequest = req.clone({
        setHeaders: {
          //      'Access-Control-Allow-Origin': '*',
          //      Accept: `application/json`,
          //                   'Content-Type': 'application/json',
          //  'Authorization': this.authService.getToken(),
          //     CrossDomain: 'true' 
        }
      });
    }
    console.log('clonedRequest', clonedRequest);
    return next.handle(clonedRequest);
  }
}

export const HeaderInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: HeaderInterceptor,
  multi: true,
};
//