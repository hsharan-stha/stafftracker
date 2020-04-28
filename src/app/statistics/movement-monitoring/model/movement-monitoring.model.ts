export class MovementMonitoringParams {
  constructor(
    public created: string,
    public msisdn: string,
    public icon_url: string,
    public name: string,
    public position: string,
    public event: string,
    public address: string
  ) {
  }
}

export class MovementMonitoringExtraParams {
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
