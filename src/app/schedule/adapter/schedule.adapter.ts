import {Injectable} from "@angular/core";
import {Adapter} from "../../core/adapter";
import {GroupEmployeeDeletedForm, GroupEmployeeForm, Schedule, ScheduleForm} from "../model/schedule.model";

@Injectable()
export class ScheduleAdapter implements Adapter<Schedule> {
  adapt(item: any): Schedule {
    return new Schedule(
      item.id,
      item.start_work,
      item.end_work,
      item.start_lunch,
      item.end_lunch,
      item.loyalty,
      item.track_freq,
      item.days,
      item.name,
      item.nr_employees,
      item.nr_groups
    );
  }
}


export class ScheduleFormAdapter implements Adapter<ScheduleForm> {
  adapt(item: any): ScheduleForm {
    let mo = (item.checkboxMO === true ? "1" : "");
    let tu = (item.checkboxTU === true ? ",2" : '');
    let we = (item.checkboxWE === true ? ",3" : '');
    let th = (item.checkboxTH === true ? ",4" : '');
    let fr = (item.checkboxFR === true ? ",5" : '');
    let sa = (item.checkboxSA === true ? ",6" : '');
    let su = (item.checkboxSU === true ? ",7" : '');
    let days = mo + tu + we + th + fr + sa + su;
    if (days.slice(0, 1) === ',') {
      days = days.slice(1, days.length);
    }
    return new ScheduleForm(
      item.id,
      item.scheduleName,
      days,
      item.startWorkTime.slice(0, 5),
      item.endWorkTime.slice(0, 5),
      item.startLunchTime.slice(0, 5),
      item.endLunchTime.slice(0, 5),
      item.loyalty.slice(0, 5),
      item.track_freq.slice(0, 5),
      item.groups,
      item.employees
    );
  }
}

export class GroupEmployeeFormAdapter implements Adapter<GroupEmployeeForm> {
  adapt(item: any): GroupEmployeeForm {
    return new GroupEmployeeForm(
      Number(item.id),
      Number(1)
    );
  }
}

export class GroupEmployeeDeletedFormAdapter implements Adapter<GroupEmployeeDeletedForm> {
  adapt(item: any): GroupEmployeeDeletedForm {
    return new GroupEmployeeDeletedForm(
      Number(item.id),
      Number(1)
    );
  }
}
