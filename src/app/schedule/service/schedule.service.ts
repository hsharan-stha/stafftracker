import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AppConfigService} from "../../service/AppConfig.service";
import {HttpClient} from "@angular/common/http";
import {ExtraParamsAdapter} from "@shared/adapter/extraParams.adapter";
import {map} from "rxjs/operators";
import {ScheduleAdapter} from "../adapter/schedule.adapter";
import {Schedule} from "../model/schedule.model";

@Injectable()
export class ScheduleService {

    private URL: string;
    private query: string = "?action=";
    private get = "get_schedules";
    private insert = "insert_schedule";
    private delete = "delete_schedule";
    private update = "update_schedule";

    private notify = new BehaviorSubject([]);

    constructor(private appConfigService: AppConfigService,
                private http: HttpClient,
                private adapter: ScheduleAdapter,
                private extraParamsAdapter: ExtraParamsAdapter
    ) {
    }


    getBaseIPURL(): string {
        return this.appConfigService.config['base_ip'];
    }


    getURL(action: string): string {
        this.URL = this.appConfigService.config['base_url'] + this.query;
        return this.URL + action;
    }

    getAll(data): Observable<Schedule[]> {
        return this.http.post<Schedule[]>(this.getURL(this.get), this.extraParamsAdapter.adapt(data)).pipe(
            map((data: any[]) => {
                    if (typeof data['result'] === 'number') {
                        return data['result'];
                    } else if (data['code'] === 0) {
                        return data['result'].map((item: any) => this.adapter.adapt(item));
                    }
                }
            )
        );
    }

    getByID(id): Observable<any> {
        let params = {
            "id": id,
            "page_number": 1
        };
        return this.http.post(this.getURL(this.get), params).pipe(
            map((data: any) => this.adapter.adapt(data['result'][0]))
        );
    }


    add(data): Observable<any> {
        return this.http.post(this.getURL(this.insert), data).pipe();
    }

    renew(data): Observable<any> {
        console.log(JSON.stringify(data));
        return this.http.post(this.getURL(this.update), data).pipe();
    }

    remove(data): Observable<any> {
        let params = {"id": data};
        return this.http.post(this.getURL(this.delete), params);
    }


    getNotify(): Observable<any> {
        return this.notify.asObservable();
    }

    setNotify(data): void {
        this.notify.next(data);
    }
}
