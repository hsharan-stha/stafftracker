import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Notification} from 'src/app/models/Notification';
import {AppConfigService} from "./AppConfig.service";
import {NotificationsAdapter} from "@shared/adapter/notifications.adapter";
import {map} from "rxjs/operators";

@Injectable()
export class NotificationService {
    private URL: string;
    private query: string = "?action=";
    private get = "get_push_up_notifs";

    constructor(
        private appConfigService: AppConfigService,
        private http: HttpClient,
        private adapter: NotificationsAdapter
    ) {
    }

    getURL(action: string): string {
        this.URL = this.appConfigService.config['base_url'] + this.query;
        return this.URL + action;
    }

    getAll(): Observable<Notification[]> {
        return this.http.post<Notification[]>(this.getURL(this.get), {'lang_id': 1}).pipe(
            map((data: any[]) => {
                return data['result'].map((item: any) => this.adapter.adapt(item));
            }));
    }
}
