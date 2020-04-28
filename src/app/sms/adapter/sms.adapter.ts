import {Injectable} from "@angular/core";
import {Adapter} from "../../core/adapter";
import {SMS} from "../model/sms.model";

@Injectable()
export class SmsAdapter implements Adapter<SMS> {
  adapt(item: any): SMS {
    return new SMS(
      item.text,
      item.date.substring(0, 10),
      item.date.substring(11, item.date.length - 3),
      item.direction
    );
  }
}
