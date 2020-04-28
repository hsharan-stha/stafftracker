import {Injectable} from "@angular/core";
import {Adapter} from "../../../core/adapter";
import {PunctualEmp} from "../model/punctual-emp.model";

@Injectable()
export class PunctualEmpAdapter implements Adapter<PunctualEmp> {
  adapt(item: any): PunctualEmp {
    return new PunctualEmp(
      item.num,
      item.id,
      item.icon_url,
      item.msisdn,
      item.name,
      item.position_name,
      item.group_name,
      item.punctual_percent
    );
  }
}
