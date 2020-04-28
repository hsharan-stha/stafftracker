import {Injectable} from '@angular/core';
import {AppConfigService} from "../../../service/AppConfig.service";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {map} from "rxjs/operators";
import {GeozoneVisitsAdapter, GeozoneVisitsExtraParamsAdapter} from "../adapter/geozone-visits.adapter";

@Injectable()
export class GeozoneVisitsService {

  private URL: string;
  private queryString: string = "?action=";
  private getMethod = "get_geozone_visits";
  private notify = new BehaviorSubject([]);

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private adapter: GeozoneVisitsAdapter,
    private extraParamsAdapter: GeozoneVisitsExtraParamsAdapter
  ) {
  }


  getURL(action: string): string {
    this.URL = this.appConfigService.config['base_url'] + this.queryString;
    return this.URL + action;
  }

  getAll(data): Observable<any> {
    return this.http.post(this.getURL(this.getMethod), this.extraParamsAdapter.adapt(data)).pipe(
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

  getNotify(): Observable<any> {
    return this.notify.asObservable();
  }

  setNotify(data): void {
    this.notify.next(data);
  }
}
