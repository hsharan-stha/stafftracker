import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {AppConfigService} from "../../service/AppConfig.service";
import {HttpClient} from "@angular/common/http";
import {GroupAdapter} from "../adapter/group.adapter";
import {map} from "rxjs/operators";
import {Group} from "../model/group.model";
import {ExtraParamsAdapter} from "@shared/adapter/extraParams.adapter";


@Injectable()
export class GroupService {
    private URL: string;
    private query: string = "?action=";
    private get = "get_groups";
    private insert = "insert_group";
    private delete = "delete_group";
    private update = "update_group";

    private notify = new BehaviorSubject([]);

    constructor(private appConfigService: AppConfigService,
                private http: HttpClient,
                private adapter: GroupAdapter,
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

    getAll(data): Observable<Group[]> {
        return this.http.post<Group[]>(this.getURL(this.get), this.extraParamsAdapter.adapt(data)).pipe(
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
