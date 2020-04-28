import { Injectable } from '@angular/core';
import { AppConfigService } from 'src/app/service/AppConfig.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { NotificationAndExplanatoryAdapter } from '../adapter/NotificationAndExplanatory.adapter';

@Injectable({
  providedIn: 'root'
})
export class NotificationsExplanatoryNotesService {
  private URL: string;
  private queryString: string = "?action=";
  private getMethod = "get_notification_notes";

  constructor(
    private appConfigService: AppConfigService,
    private http: HttpClient,
    private naeAdapter:NotificationAndExplanatoryAdapter 
  ) { }
  getBaseIPURL(): string {
    return this.appConfigService.config['base_ip'];
  }

  getURL(action: string): string {
    this.URL = this.appConfigService.config['base_url'] + this.queryString;
    return this.URL + action;
  }
  getData(data): Observable<any[]> {
    let method = this.getMethod;
    return this.http.post<any[]>(this.getURL(method), data).pipe(
      map((data: any[]) => {
        if (typeof data['result'] === 'number') {
          return data['result'].map((data: any[]) => this.naeAdapter.adapt(data));;
        } else if (data['code'] === 0) {
          return data['result'].map((data: any[]) => this.naeAdapter.adapt(data));;
        }
      }
      )
    );
  }
}
//