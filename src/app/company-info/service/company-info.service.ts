import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {CompanyInfoModel} from "../model/company-info.model";
import {AppConfigService} from "../../service/AppConfig.service";
import {CompanyInfoAdapter,CompanyInfoFormAdapter} from "../adapter/company-info.adapter";


@Injectable({
  providedIn: 'root'
})
export class CompanyInfoService {
    private URL: string;
    private queryString: string = "?action=";
    private getMethod = "get_company";
    private updateMethod = "update_company";
    
    constructor(
        private appConfigService: AppConfigService,
        private companyInfoAdapter: CompanyInfoAdapter,
        private companyInfoFormAdapter: CompanyInfoFormAdapter,
        private http: HttpClient,
    ) { }
    
    getBaseIPURL() : string{
        return this.appConfigService.config['base_ip'];
    }
    
    getURL(action: string): string {
        this.URL = this.appConfigService.config['base_url'] + this.queryString;
        return this.URL + action;
    }
  
    getCompanyInfo() : Observable<any>{
        return this.http.post(this.getURL(this.getMethod),[]).pipe(
            map((data:any[])=>{
                return this.companyInfoAdapter.adapt(data['result'][0]);
            })
            
        );
    }
    
    update(data):Observable<any>{
        console.log(data);
        let adaptedData = this.companyInfoFormAdapter.adapt(data);
        console.log(adaptedData);
        return this.http.post(this.getURL(this.updateMethod),  adaptedData).pipe();
    }
}
