import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {GeozoneModel, GeozoneTblModel} from "../model/geozone.model";
import {AppConfigService} from "../../service/AppConfig.service";
import {GeozoneAdapter, GeozoneTblAdapter} from "../adapter/geozone.adapter";
import {ExtraParamsAdapter} from "@shared/adapter/extraParams.adapter";

@Injectable()
export class GeozoneService {
    private URL: string;
    private queryString: string = "?action=";
    private getMethod = "get_geozones";
    private insertMethod = "insert_geozone";
    private deleteMethod = "delete_geozone";
    private updateMethod = "update_geozone";

    constructor(
        private appConfigService: AppConfigService,
        private http: HttpClient,
        private geozoneAdapter: GeozoneAdapter,
        private geozoneTblAdapter: GeozoneTblAdapter,
        private geozoneTblExtraAdapter: ExtraParamsAdapter
    ) {
    }


    getBaseIPURL() : string{
        return this.appConfigService.config['base_ip'];
    }

    getURL(action: string): string {
        this.URL = this.appConfigService.config['base_url'] + this.queryString;
        return this.URL + action;
    }

    getAll(data): Observable<GeozoneTblModel[]> {
        return this.http.post<GeozoneTblModel[]>(this.getURL(this.getMethod), this.geozoneTblExtraAdapter.adapt(data)).pipe(
            map((data: any[]) => {
                    if (typeof data['result'] === 'number') {
                        return data['result'];
                    } else if (data['code'] === 0) {
                        return data['result'].map((data: any[]) => this.geozoneTblAdapter.adapt(data));
                    }
                }
            )
        );

    }

    save(data): Observable<any> {
        console.log(this.geozoneAdapter.adapt(data));
        return this.http.post(this.getURL(this.insertMethod),  this.geozoneAdapter.adapt(data)).pipe();
    }

    update(data):Observable<any>{
        let adaptedData = this.geozoneAdapter.adapt(data);
        adaptedData['id']  = data.id;
        return this.http.post(this.getURL(this.updateMethod),  adaptedData).pipe();
    }

    getByID(ID) : Observable<any>{
        let params = {
            "id": ID,
            "page_number": 1
        };

        return this.http.post(this.getURL(this.getMethod),params).pipe(
            map((data:any[])=>{
                return this.geozoneTblAdapter.adapt(data['result'][0]);
            })

        );
    }

    remove(ID): Observable<any> {
        let params = {
            "id": ID,
        }
        return this.http.post(this.getURL(this.deleteMethod), params);
    }

    private notify = new BehaviorSubject([]);
    getNotify(): Observable<any> {
        return this.notify.asObservable();
    }

    setNotify(data): void {
        this.notify.next(data);
    }
}
