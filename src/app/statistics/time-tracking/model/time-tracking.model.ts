export class TimeTrackingParams {
  constructor(
    public icon_url: string,
    public name: string,
    public position: string,
    public group_url: string,
    public group: string,
    public summary: any,
    public schedule: string,
    public hours_worked: number,
    public lateness: number
  ) {
  }
}

export class TimeTrackingExtraParams {
  constructor(
    public date_from: string,
    public date_to: string,
    public employee_id: number,
    public group_id: number,
    public limit: string,
    public page_number: string,
    public order_by: string,
    public order_direction: string,
    public for_export: number
  ) {
  }
}