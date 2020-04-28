import {Adapter} from "../../../core/adapter";
import {Injectable} from "@angular/core";
import {MovementList} from "../model/movementlist.model";

@Injectable({providedIn: 'root'})
export class MovementlistAdapter implements Adapter<MovementList> {
  adapt(item: any): MovementList {
    return new MovementList(
      item.id,
      Number(item.latitude),
      Number(item.longitude),
      item.address,
      item.created.substring(11, item.created.length)
    );
  }
}
