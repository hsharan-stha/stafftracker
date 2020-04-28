import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {Position, PositionForm} from "../model/position.model";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {PositionAdapter, PositionFormAdapter} from "../adapter/position.adapter";
import {AppConfigService} from "../../service/AppConfig.service";
import {ExtraParamsAdapter} from "@shared/adapter/extraParams.adapter";

@Injectable()
export class PositionService {
    private URL: string;
    private query: string = "?action=";
    private get = "get_positions";
    private insert = "insert_position";
    private delete = "delete_position";
    private update = "update_position";

    private notify = new BehaviorSubject([]);


    constructor(private appConfigService: AppConfigService,
                private http: HttpClient,
                private adapter: PositionAdapter,
                private formAdapter: PositionFormAdapter,
                private extraParamsAdapter: ExtraParamsAdapter
    ) {
    }

    getURL(action: string): string {
        this.URL = this.appConfigService.config['base_url'] + this.query;
        return this.URL + action;
    }

    getAll(data): Observable<Position[]> {
        return this.http.post<Position[]>(this.getURL(this.get), this.extraParamsAdapter.adapt(data)).pipe(
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
        return this.http.post(this.getURL(this.insert), this.formAdapter.adapt(data)).pipe();
    }

    renew(data, id): Observable<any> {
        let params = {
            "id": id,
            "position_name": data.name
        }
        return this.http.post(this.getURL(this.update), params).pipe();
    }

    remove(data): Observable<any> {
        let params = {
            "id": data,
        }
        return this.http.post(this.getURL(this.delete), params);
    }

    getNotify(): Observable<any> {
        return this.notify.asObservable();
    }

    setNotify(data): void {
        this.notify.next(data);
    }

}
