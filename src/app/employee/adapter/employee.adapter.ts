import {Adapter} from "../../core/adapter";
import {Injectable} from "@angular/core";
import {EmployeeModel, EmployeeTblModel} from "../model/employee.model";


@Injectable()

export class EmployeeAdapter implements Adapter<EmployeeModel> {

    adapt(data: any): EmployeeModel {
        return new EmployeeModel(
            data.msisdn,
            data.email,
            data.name,
            data.group_id,
            data.position_id,
            data.icon_url,
            data.description,
            data.role_id,
            data.password
        );
    }

}


export class EmployeeTblAdapter implements Adapter<EmployeeTblModel> {
    adapt(data: any): EmployeeTblModel {
        return new EmployeeTblModel(
            data.id,
            data.name,
            data.email,
            data.position,
            data.position_id,
            data.icon_url,
            data.group,
            data.group_id,
            data.group_icon_url,
            data.msisdn,
            data.last_location_status,
            data.last_location,
            data.description,
            data.rejected_tracking,
        );
    }
}
