import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppConfigService} from "../../../service/AppConfig.service";
import {ExtraParamsAdapter} from "@shared/adapter/extraParams.adapter";
import {MovementMonitoringAdapter,MovementMonitoringExtraAdapter} from "../adapter/movement-monitoring.adapter";

@Injectable({
  providedIn: 'root'
})

export class MovementMonitoringService {
    private URL: string;
    private queryString: string = "?action=";
    private getMethod = "get_movements_monitoring";

    constructor(
        private appConfigService: AppConfigService,
        private http: HttpClient,
        private extraParamAdapter: MovementMonitoringExtraAdapter,
        private adapter: MovementMonitoringAdapter
    ) {
    }
    
    
    getURL(action: string): string {
        this.URL = this.appConfigService.config['base_url'] + this.queryString;
        return this.URL + action;
    }

    getAll(data): Observable<any> {
        return this.http.post(this.getURL(this.getMethod), this.extraParamAdapter.adapt(data)).pipe(
            map((data: any[]) => {
                    if (typeof data['result'] === 'number') {
                        return data['result'];
                    } else if (data['code'] === 0) {
                        return data['result'].map(item => this.adapter.adapt(item));
                    }
                }
            )
        );

    }
    
    private notify = new BehaviorSubject([]);
    getNotify(): Observable<any> {
        return this.notify.asObservable();
    }

    setNotify(data): void {
        this.notify.next(data);
    }
}

