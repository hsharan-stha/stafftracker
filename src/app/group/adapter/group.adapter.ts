import {Injectable} from "@angular/core";
import {Adapter} from "../../core/adapter";
import {Group, GroupEmpDeletedForm, GroupEmpForm, GroupForm} from "../model/group.model";

@Injectable()
export class GroupAdapter implements Adapter<Group> {
    adapt(item: any): Group {
        return new Group(
            item.id,
            item.name,
            item.icon_url,
            item.nr_employees,
            item.rejected_tracking
        );
    }
}

export class GroupFormAdapter implements Adapter<GroupForm> {
    adapt(item: any): GroupForm {
        return new GroupForm(
            item.id,
            item.data.name,
            item.data.image.file,
            item.data.avatar,
            item.strEmpData
        );
    }
}

export class GroupEmpFormAdapter implements Adapter<GroupEmpForm> {
    adapt(item: any): GroupEmpForm {
        return new GroupEmpForm(
            Number(item.id),
            Number(1)
        );
    }
}

export class GroupEmpDeletedFormAdapter implements Adapter<GroupEmpDeletedForm> {
    adapt(item: any): GroupEmpDeletedForm {
        return new GroupEmpDeletedForm(
            Number(item.id),
            Number(1)
        );
    }
}
