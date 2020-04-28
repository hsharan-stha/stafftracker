import {Injectable} from '@angular/core';
import {AppConfigService} from "./AppConfig.service";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class CaptchaService {
    private URL: string;
    private query: string = "?action=";
    private get_captcha = "get_captcha";
    private check_captcha = "check_captcha";
    private captcha = new BehaviorSubject([]);

    constructor(private appConfigService: AppConfigService, private http: HttpClient) {
    }

    getURL(action: string): string {
        this.URL = this.appConfigService.config['base_url'] + this.query;
        return this.URL + action;
    }

    getCaptch(): Observable<any> {
        return this.http.post<any>(this.getURL(this.get_captcha), []).pipe();
    }

    checkCaptcha(data): Observable<any> {
        return this.http.post(this.getURL(this.check_captcha), data).pipe();
    }

    getCaptchaCode(): Observable<any> {
        return this.captcha.asObservable();
    }

    setCaptchaCode(data): void {
        this.captcha.next(data);
    }

}
