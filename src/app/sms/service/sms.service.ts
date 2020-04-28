import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {AppConfigService} from "../../service/AppConfig.service";
import {HttpClient} from "@angular/common/http";
import {ExtraParamsAdapter} from "@shared/adapter/extraParams.adapter";
import {map} from "rxjs/operators";
import {SmsAdapter} from "../adapter/sms.adapter";
import {SMS} from "../model/sms.model";

@Injectable()
export class SmsService {
  private URL: string;
  private query: string = "?action=";
  private get = "get_messages_for_chat";
  private send = "send_message";


  constructor(private appConfigService: AppConfigService,
              private http: HttpClient,
              private adapter: SmsAdapter,
              private extraParamsAdapter: ExtraParamsAdapter
  ) {
  }


  getURL(action: string): string {
    this.URL = this.appConfigService.config['base_url'] + this.query;
    return this.URL + action;
  }

  getAll(data): Observable<SMS[]> {
    return this.http.post<SMS[]>(this.getURL(this.get), this.extraParamsAdapter.adapt(data)).pipe(
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

  sendMessage(data): Observable<any> {
    return this.http.post(this.getURL(this.send), data).pipe();
  }


}
