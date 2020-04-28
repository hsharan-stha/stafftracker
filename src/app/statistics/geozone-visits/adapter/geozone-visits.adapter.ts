import {Injectable} from "@angular/core";
import {GeozoneVisitsExtraParams, GeozoneVists} from "../model/geozone-visits.model";
import {Adapter} from "../../../core/adapter";

@Injectable()
export class GeozoneVisitsAdapter implements Adapter<GeozoneVists> {
  adapt(item: any): GeozoneVists {
    return new GeozoneVists(
      item.geo_name,
      item.address,
      item.radius,
      item.created.substring(0, item.created.length - 8),
      item.created.substring(11, item.created.length),
      item.name,
      item.icon_url,
      item.position,
      item.event
    );
  }
}

export class GeozoneVisitsExtraParamsAdapter implements Adapter<GeozoneVisitsExtraParams> {
  adapt(item: any): GeozoneVisitsExtraParams {
    return new GeozoneVisitsExtraParams(
      item.geozone_id,
      item.date_from,
      item.date_to,
      item.limit,
      item.page_number,
      item.order_by,
      item.order_direction,
      item.for_export,
    );
  }
}
