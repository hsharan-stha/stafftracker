import {Injectable} from "@angular/core";
import {MovementMonitoringExtraParams, MovementMonitoringParams} from "../model/movement-monitoring.model";
import {Adapter} from "../../../core/adapter";

@Injectable()
export class MovementMonitoringAdapter implements Adapter<MovementMonitoringParams> {
  adapt(item: any): MovementMonitoringParams {
    return new MovementMonitoringParams(
        item.created,
        item.msisdn,
        item.icon_url,
        item.name,
        item.position,
        item.event,
        item.address    
    );
  }
}

export class MovementMonitoringExtraAdapter implements Adapter<MovementMonitoringExtraParams> {
  adapt(item: any): MovementMonitoringExtraParams {
    return new MovementMonitoringExtraParams(
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

