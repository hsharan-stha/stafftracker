import {Adapter} from "../../core/adapter";
import {Injectable} from "@angular/core";
import {ExtraParams} from "../../models/extraParams.model";

@Injectable({providedIn: 'root'})
export class ExtraParamsAdapter implements Adapter<ExtraParams> {
    adapt(item: any): ExtraParams {
        return new ExtraParams(
            item.id,
            item.msisdn,
            item.limit,
            item.page_number,
            item.order_by,
            item.order_direction,
            item.filters
        );
    }
}
