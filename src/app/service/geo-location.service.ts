import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "./AppConfig.service";
import {MovementlistAdapter} from "../main/movement-tracking/adapter/movementlist.adapter";

@Injectable()

export class GeoLocationService {
  private URL: string;
  private query: string = "?action=";
  private get_location = "get_current_location";
  private get_emp_count = "get_count_of_employee_in_geo";
  private get_period_location = "get_location_for_period";

  constructor(private appConfigService: AppConfigService, private http: HttpClient, private momementlistAdapter: MovementlistAdapter) {
  }

  getURL(action: string): string {
    this.URL = this.appConfigService.config['base_url'] + this.query;
    return this.URL + action;
  }

  getCurrentLocation(data): Observable<any> {
    return this.http.post<any>(this.getURL(this.get_location), data).pipe();
  }

  getCountOfEmployee(data): Observable<any> {
    return this.http.post<any>(this.getURL(this.get_emp_count), data).pipe();
  }

  getPeriodicLocation(data): Observable<any> {
    let id = 1;
    return this.http.post<any>(this.getURL(this.get_period_location), data).pipe(
      map((res: any[]) => {
        if (res['code'] === 0) {
          return res['result'].map(item => this.momementlistAdapter.adapt(Object.assign(item, {id: id++})));
        }
      })
    );
  }

}
