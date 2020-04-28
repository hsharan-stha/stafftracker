import {Adapter} from "../../core/adapter";
import {Injectable} from "@angular/core";
import {Notification} from "../../models/Notification";

@Injectable({providedIn: 'root'})
export class NotificationsAdapter implements Adapter<Notification> {
    adapt(item: any): Notification {
        return new Notification(
            item.type,
            item.time,
            item.text,
        );
    }
}