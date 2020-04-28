import {Injectable} from '@angular/core';
import {AppConfigService} from "../../../service/AppConfig.service";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {PunctualEmpAdapter} from "../adapter/punctual-emp.adapter";
import {ExtraParamsAdapter} from "@shared/adapter/extraParams.adapter";

@Injectable()
export class PunctualEmployeeService {

  private URL: string;
  private query: string = "?action=";
  private get_method = "get_punctual_employees";


  constructor(private appConfigService: AppConfigService,
              private http: HttpClient,
              private adapter: PunctualEmpAdapter,
              private extraParamsAdapter: ExtraParamsAdapter) {
  }

  getURL(action: string): string {
    this.URL = this.appConfigService.config['base_url'] + this.query;
    return this.URL + action;
  }

  getAll(data): Observable<any> {
    let no = 1;
    return this.http.post<any>(this.getURL(this.get_method), this.extraParamsAdapter.adapt(data)).pipe(
      map((res: any[]) => {
        if (typeof res['result'] === 'number') {
          return res['result'];
        } else if (res['code'] === 0) {
          return res['result'].map(item => this.adapter.adapt(Object.assign(item, {num: no++})));
        }
      })
    );
  }
}
