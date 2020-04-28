import {Adapter} from "../../core/adapter";
import {Injectable} from "@angular/core";
import {Position, PositionForm} from "../model/position.model";

@Injectable()
export class PositionAdapter implements Adapter<Position> {
    adapt(item: any): Position {
        return new Position(
            item.id,
            item.name
        );
    }
}

export class PositionFormAdapter implements Adapter<PositionForm> {
    adapt(item: any): PositionForm {
        return new PositionForm(
            item.name
        );
    }
}
