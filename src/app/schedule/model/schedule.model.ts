import {Time} from "@angular/common";

export class Schedule {
  constructor(
    public id: string,
    public start_work: Time,
    public end_work: Time,
    public start_lunch: Time,
    public end_lunch: Time,
    public loyalty: Time,
    public track_freq: Time,
    public days: string,
    public name: string,
    public nr_employees: number,
    public nr_groups: number,
  ) {
  }
}

export class ScheduleForm {
  constructor(
    public id: string,
    public schedule_name: string,
    public days: string,
    public start_work: Time,
    public end_work: Time,
    public start_lunch: Time,
    public end_lunch: Time,
    public loyalty: Time,
    public track_freq: Time,
    public groups: Array<GroupEmployeeForm>,
    public employees: Array<GroupEmployeeForm>
  ) {
  }
}

export class GroupEmployeeForm {
  constructor(
    public id: number,
    public added: number
  ) {
  }
}

export class GroupEmployeeDeletedForm {
  constructor(
    public id: number,
    public deleted: number
  ) {
  }
}
