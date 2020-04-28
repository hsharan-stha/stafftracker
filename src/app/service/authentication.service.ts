import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of as observableOf, observable } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AppConfigService } from './AppConfig.service';
const helper = new JwtHelperService();
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private access_tokenSubject: BehaviorSubject<any>;
    private activation_code;
    public access_token: Observable<any>;

    constructor(private http: HttpClient,
        private appConfigService: AppConfigService
    ) {
        this.access_tokenSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('access_token')));
        this.access_token = this.access_tokenSubject.asObservable();
        setInterval((() => {
            console.log('is token expired - using helper', helper.isTokenExpired(localStorage.getItem('access_token')));
        }), 4000);
    }

    public get access_tokenValue(): any {
        return this.access_tokenSubject.value;
    }

    login(msisdn: string, password: string) {
        //console.log(`trying to login with ${anyname}:${password}`);
        //let auth: string = btoa(msisdn.concat(':', password));
        let data = {
            msisdn: msisdn,
            password: password
        };
        return this.http.post<any>(this.appConfigService.config['base_url'] + '?action=login', data)
            //return this.http.post<any>(this.test_url, data)
            .pipe(map(data => {
                // login successful if there's a jwt token in the response
                console.log('data', data);
                // store any details and jwt token in local storage to keep any logged in between page refreshes
                console.log('token', JSON.stringify(data['result']['token']));
                //localStorage.setItem('access_token', JSON.stringify(data['result']['token']));
                this.setAccessToken(JSON.stringify(data['result']['token']));
                this.setRefreshToken(JSON.stringify(data['result']['token']));
                localStorage.setItem('role', JSON.stringify(data['result']['role']));
                this.access_tokenSubject.next(data);
                return data;
            }));
    }
    logout() {
        return this.http.post<any>(this.appConfigService.config['base_url'] + '?action=logout', {})
            .pipe(map(data => {
                return data;
            }));

    }

    onUnauthorized() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.access_tokenSubject.next(null);
    }
    getToken() {
        console.log('get toekn');
        return JSON.parse(localStorage.getItem('access_token'));
    }
    
    //does access_token exist in local storage
    isTokenExpired(): boolean {
        //let isTokenExpired = true;
        if (localStorage.getItem('access_token')) {
           // return (helper.isTokenExpired(localStorage.getItem('access_token')));
            return false;
            //isTokenExpired = this.helper.isTokenExpired();
        } else {
            return true;
        }
    }
    getActivationCode(msisdn: string) {
        //console.log(`trying to login with ${anyname}:${password}`);
        //let auth: string = btoa(msisdn.concat(':', password));
        let data = {
            msisdn: msisdn
        };
        console.log(data);
        return this.http.post<any>(this.appConfigService.config['base_url'] + '?action=registration_code', data)
            //return this.http.post<any>(this.test_url, data)
            .pipe(map(data => {
                // login successful if there's a jwt token in the response
                console.log('data', data);
                return data;
            }));
    }
    register(msisdn: string, code: string) {
        let data = {
            msisdn: msisdn,
            activation_code: code
        };
        return this.http.post<any>(this.appConfigService.config['base_url'] + '?action=registration_code_validate', data)
            .pipe(map(data => {
                console.log('data', data);
                return data;
            }));
    }
    registrationFinalize(data) {
        return this.http.post<any>(this.appConfigService.config['base_url'] + '?action=registration_finishing', data)
            .pipe(map(data => {
                console.log('data', data);
                return data;
            }));
    }
    get activationCode() {
        return this.activation_code;
    }
    setActivationCode(code) {
        this.activation_code = code;
    }

    validateToken() {
        return this.http.post<any>(this.appConfigService.config['base_url'] + '?action=validate_token', {},{ headers: {'testkey': 'test'}})
            //return this.http.post<any>(this.test_url, data)
            .pipe(map(data => {
                console.log('validte token response', data);
                console.log('token', JSON.stringify(data['result']['token']));
                localStorage.setItem('access_token', JSON.stringify(data['result']['token']));
                // localStorage.setItem('role', JSON.stringify(data['result']['role']));
                this.access_tokenSubject.next(data);
                return data;
            }));
    }
   
    refreshToken(): Observable<any> {
        console.log('refreshtoekn auth service');
        const headers = new HttpHeaders({'Authorization': this.getRefreshToken()});

        return this.http.post(this.appConfigService.config['base_url'] + '?action=validate_token',{},{ headers: {'Authorization': this.getRefreshToken()}});
        // .pipe(
        //     map(data => {
        //         console.log('validte token response', data);
        //         console.log('token', JSON.stringify(data['result']['token']));
        //         localStorage.setItem('access_token', JSON.stringify(data['result']['token']));
        //         return JSON.stringify(data['result']['token']);
        //     }));    
        
        // .pipe(
            //     map(data => {
            //         console.log('validte token response', data);
            //         console.log('token', JSON.stringify(data['result']['token']));
            //         localStorage.setItem('access_token', JSON.stringify(data['result']['token']));
            //         return data;
            //     }));

        //return observableOf(this.authTokenNew).pipe(delay(200));
    }
    public currentToken: string;
    getAuthToken(){
        console.log('getAuthToken()');
        return JSON.parse(localStorage.getItem('access_token'));
    }
    getRefreshToken(){
        console.log('refresh_code()');
        return JSON.parse(localStorage.getItem('refresh_token'));
    }
    setAccessToken(token){
        console.log('compare token', localStorage.getItem('refresh_token'), token, localStorage.getItem('access_token') == token);
        localStorage.setItem('access_token', token);
    }
    setRefreshToken(token){
        console.log('compare token', localStorage.getItem('refresh_token'), token, localStorage.getItem('access_token') == token);
        localStorage.setItem('refresh_token', token);
    }
}