import {Injectable} from "@angular/core";
import {TimeTrackingExtraParams, TimeTrackingParams} from "../model/time-tracking.model";
import {Adapter} from "../../../core/adapter";

@Injectable()
export class TimeTrackingAdapter implements Adapter<TimeTrackingParams> {
  adapt(item: any): TimeTrackingParams {
    return new TimeTrackingParams(
        item.icon_url,
        item.name,
        item.position,
        item.group_url,
        item.group,
        item.summary,
        item.schedule,
        item.hours_worked,
        item.lateness       
    );
  }
}


export class TimeTrackingExtraAdapter implements Adapter<TimeTrackingExtraParams> {
  adapt(item: any): TimeTrackingExtraParams {
    return new TimeTrackingExtraParams(
      item.date_from,
      item.date_to,
      item.employee_id,
      item.group_id,
      item.limit,
      item.page_number,
      item.order_by,
      item.order_direction,
      item.for_export
    );
  }
}

